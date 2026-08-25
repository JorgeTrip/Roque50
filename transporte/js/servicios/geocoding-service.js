/**
 * Servicio de Geocodificación y Manejo de Zonas - Módulo Transporte
 */

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function guessRegion(lat, lon) {
  if (lat <= -34.53 && lat >= -34.71 && lon <= -58.34 && lon >= -58.53) return "CABA";
  return "PBA";
}

function baseName(name) {
  const firstPart = (name || "").split(",")[0].trim();
  return typeof normalizarTexto === "function" ? normalizarTexto(firstPart) : firstPart.toLowerCase();
}

function findFallbackZone(query) {
  if (!query || typeof query !== "string") return null;
  const q = typeof normalizarTexto === "function" ? normalizarTexto(query) : query.toLowerCase();
  const list = (zoneOptions && zoneOptions.length) ? zoneOptions : ZONE_DEFAULTS;
  const match = list.find(z => {
    if (!z.name || z.lat == null) return false;
    const bName = baseName(z.name);
    return bName.length >= 3 && (q.includes(bName) || bName.includes(q));
  });
  if (match && match.lat != null) return match;
  return null;
}

async function geocodeAddressOnline(query) {
  if (!query || !query.trim()) return null;
  const cleanQ = query.trim();

  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(cleanQ)}&countrycodes=ar&addressdetails=1&limit=1&accept-language=es`;
    const res = await fetch(nomUrl, { headers: { "Accept": "application/json" } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const r = data[0];
      const lat = parseFloat(r.lat);
      const lon = parseFloat(r.lon);
      const region = guessRegion(lat, lon);
      const isAddr = !!(r.address && (r.address.house_number || r.address.road));
      return { name: cleanQ, lat, lon, region, kind: isAddr ? "address" : "zone" };
    }
  } catch (e) {}

  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=-34.62&lon=-58.6&limit=1`;
    const res2 = await fetch(photonUrl);
    const data2 = await res2.json();
    if (data2 && data2.features && data2.features.length > 0) {
      const f = data2.features[0];
      const lon = f.geometry.coordinates[0], lat = f.geometry.coordinates[1];
      const region = guessRegion(lat, lon);
      const isAddr = !!(f.properties && f.properties.housenumber);
      return { name: cleanQ, lat, lon, region, kind: isAddr ? "address" : "zone" };
    }
  } catch (e) {}

  const fallback = findFallbackZone(cleanQ);
  if (fallback) {
    return { name: cleanQ, lat: fallback.lat, lon: fallback.lon, region: fallback.region, kind: fallback.kind || "zone" };
  }
  return null;
}

async function searchOnlineAutocomplete(query) {
  if (!query || query.trim().length < 3) return [];
  const cleanQ = query.trim(), results = [], seen = new Set();
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=-34.62&lon=-58.6&limit=7`;
    const res = await fetch(photonUrl);
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      data.features.forEach(f => {
        const lon = f.geometry.coordinates[0], lat = f.geometry.coordinates[1], p = f.properties || {};
        let streetPart = p.street || p.name || "";
        if (p.housenumber && !streetPart.includes(p.housenumber)) streetPart = `${streetPart} ${p.housenumber}`;
        const cityPart = p.city || p.district || p.locality || p.county || p.state || "";
        const name = [streetPart, cityPart].filter(Boolean).join(", ") || cleanQ;
        const key = name.toLowerCase();
        if (!seen.has(key)) { seen.add(key); results.push({ name, lat, lon, region: guessRegion(lat, lon), kind: p.housenumber ? "address" : "zone" }); }
      });
    }
  } catch (e) {}

  if (results.length === 0 && cleanQ.length >= 5 && /\d/.test(cleanQ)) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(cleanQ)}&countrycodes=ar&addressdetails=1&limit=3`;
      const res2 = await fetch(nomUrl, { headers: { "Accept": "application/json" } });
      if (res2.ok) {
        const data2 = await res2.json();
        if (Array.isArray(data2)) {
          data2.forEach(r => {
            const lat = parseFloat(r.lat), lon = parseFloat(r.lon), addr = r.address || {};
            let streetPart = addr.road || addr.pedestrian || r.display_name.split(",")[0];
            if (addr.house_number && !streetPart.includes(addr.house_number)) streetPart = `${streetPart} ${addr.house_number}`;
            const cityPart = addr.suburb || addr.neighbourhood || addr.city || addr.town || "";
            const name = [streetPart, cityPart].filter(Boolean).join(", ") || r.display_name.split(",").slice(0, 2).join(",");
            const key = name.toLowerCase();
            if (!seen.has(key)) { seen.add(key); results.push({ name, lat, lon, region: guessRegion(lat, lon), kind: addr.house_number ? "address" : "zone" }); }
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function resolveZoneEntry(newEntry) {
  const idx = zoneOptions.findIndex(z => baseName(z.name) === baseName(newEntry.name));
  if (idx === -1) {
    let lat = newEntry.lat, lon = newEntry.lon, region = newEntry.region, kind = newEntry.kind;
    if (lat == null && newEntry.name) {
      const fallback = findFallbackZone(newEntry.name);
      if (fallback) {
        lat = fallback.lat; lon = fallback.lon; region = fallback.region; kind = fallback.kind;
      }
    }
    if (lat != null) {
      zoneOptions.push({ name: newEntry.name, lat, lon, region, kind: kind || "zone" });
      await saveZones();
    }
    return { name: newEntry.name, lat, lon, region, kind: kind || null };
  }
  const existing = zoneOptions[idx];
  const existingHasQualifier = existing.name.includes(",");
  const newHasQualifier = (newEntry.name || "").includes(",");
  let finalName = existing.name;
  if (!existingHasQualifier && newHasQualifier) { finalName = newEntry.name; }
  const finalLat = (existing.lat != null) ? existing.lat : newEntry.lat;
  const finalLon = (existing.lon != null) ? existing.lon : newEntry.lon;
  const finalRegion = existing.region || newEntry.region;
  const finalKind = existing.kind || newEntry.kind || "zone";

  if (finalName !== existing.name) {
    const oldName = existing.name;
    guests.forEach(g => {
      if (g.zone === oldName) {
        g.zone = finalName; g.zoneLat = finalLat; g.zoneLon = finalLon; g.zoneRegion = finalRegion; g.zoneKind = finalKind;
      }
    });
    await saveGuests();
  }
  zoneOptions[idx] = { name: finalName, lat: finalLat, lon: finalLon, region: finalRegion, kind: finalKind, isDestination: existing.isDestination };
  await saveZones();
  return { name: finalName, lat: finalLat, lon: finalLon, region: finalRegion, kind: finalKind };
}

function migrateGuestCoords() {
  if (typeof sanitizeGuestsList === "function") guests = sanitizeGuestsList(guests);
  zoneOptions.forEach(z => { if (!z.kind) z.kind = "zone"; });

  guests.forEach(g => {
    if (!g.special && !Array.isArray(g.people)) {
      g.people = deriveInitialPeople(g.names, g.personas);
    }
    if (g.zone && !g.zoneLat) {
      let match = zoneOptions.find(z => z.name === g.zone);
      if (!match) match = findFallbackZone(g.zone);
      if (match) { g.zoneLat = match.lat; g.zoneLon = match.lon; g.zoneRegion = match.region; g.zoneKind = match.kind; }
    }
    if (g.zoneLat === undefined) g.zoneLat = null;
    if (g.zoneLon === undefined) g.zoneLon = null;
    if (g.zoneRegion === undefined) g.zoneRegion = null;
    if (g.zoneKind === undefined || g.zoneKind === null) {
      if (g.zone) {
        const match = zoneOptions.find(z => z.name === g.zone);
        g.zoneKind = match ? match.kind : (g.zoneLat ? "address" : null);
      } else {
        g.zoneKind = null;
      }
    }
  });
}

async function autoGeocodeMissingGuests() {
  let updated = false;
  for (const g of guests) {
    if (g.zone && !g.zoneLat) {
      const geo = await geocodeAddressOnline(g.zone);
      if (geo && geo.lat != null) {
        g.zoneLat = geo.lat; g.zoneLon = geo.lon; g.zoneRegion = geo.region; g.zoneKind = geo.kind;
        updated = true;
      }
    }
  }
  if (updated) {
    await saveGuests();
    render();
  }
}
