/**
 * Módulo para extraer metadatos (título, artista, álbum, año y carátula)
 * directamente del contenedor del archivo M4A/MP4.
 */
window.obtenerMetadatosM4A = async function(urlRuta) {
  const metadatosPredeterminados = {
    titulo: 'Bring Your Love',
    artista: 'Madonna; Sabrina Carpenter',
    album: 'CONFESSIONS II',
    anio: '2026',
    caratula: 'imagenes/cover.jpg'
  };

  // Al abrir directamente como archivo local file://, usar metadatos pre-extraídos sin emitir error CORS
  if (window.location.protocol === 'file:') {
    return metadatosPredeterminados;
  }

  try {
    const respuesta = await fetch(urlRuta);
    if (!respuesta.ok) return metadatosPredeterminados;

    const buffer = await respuesta.arrayBuffer();
    const vistaDatos = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    const decodificadorTexto = new TextDecoder('utf-8');

    let posIlst = -1;
    for (let i = 0; i < bytes.length - 4; i++) {
      if (bytes[i] === 105 && bytes[i + 1] === 108 && bytes[i + 2] === 115 && bytes[i + 3] === 116) {
        posIlst = i;
        break;
      }
    }

    if (posIlst === -1) return metadatosPredeterminados;

    const metadatos = { ...metadatosPredeterminados };
    const tamanoIlst = vistaDatos.getUint32(posIlst - 4);
    let offset = posIlst + 4;
    const limite = Math.min(posIlst + tamanoIlst, bytes.length);

    while (offset < limite - 8) {
      const tamanoAtomo = vistaDatos.getUint32(offset);
      if (tamanoAtomo < 8 || offset + tamanoAtomo > bytes.length) break;

      const tipoAtomo = decodificadorTexto.decode(bytes.subarray(offset + 4, offset + 8));

      let posData = -1;
      for (let j = offset + 8; j < offset + tamanoAtomo - 4; j++) {
        if (bytes[j] === 100 && bytes[j + 1] === 97 && bytes[j + 2] === 116 && bytes[j + 3] === 97) {
          posData = j;
          break;
        }
      }

      if (posData !== -1) {
        const tamanoData = vistaDatos.getUint32(posData - 4);
        const valorBytes = bytes.subarray(posData + 12, posData - 4 + tamanoData);

        if (tipoAtomo === '\xa9nam') {
          metadatos.titulo = decodificadorTexto.decode(valorBytes).trim();
        } else if (tipoAtomo === '\xa9ART' || tipoAtomo === 'aART') {
          metadatos.artista = decodificadorTexto.decode(valorBytes).trim();
        } else if (tipoAtomo === '\xa9alb') {
          metadatos.album = decodificadorTexto.decode(valorBytes).trim();
        } else if (tipoAtomo === '\xa9day') {
          metadatos.anio = decodificadorTexto.decode(valorBytes).trim();
        } else if (tipoAtomo === 'covr' && valorBytes.length > 500) {
          const blobCover = new Blob([valorBytes], { type: 'image/jpeg' });
          metadatos.caratula = URL.createObjectURL(blobCover);
        }
      }

      offset += tamanoAtomo;
    }

    return metadatos;
  } catch (error) {
    return metadatosPredeterminados;
  }
};
