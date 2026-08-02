/**
 * Configuración e inicialización de Firebase SDK para el módulo de Transporte
 * Proyecto: transporte-47fe6
 */

const firebaseConfig = {
  apiKey: "AIzaSyCiz4e3WS6C4FrS0uoxMadwBYnV1eVHqBA",
  authDomain: "transporte-47fe6.firebaseapp.com",
  databaseURL: "https://transporte-47fe6-default-rtdb.firebaseio.com",
  projectId: "transporte-47fe6",
  storageBucket: "transporte-47fe6.firebasestorage.app",
  messagingSenderId: "219351186947",
  appId: "1:219351186947:web:a7ee9b4b58c506255b9836",
  measurementId: "G-XVP0NBS8J2"
};

// Inicializar Firebase
let app = null;
let db = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    isFirebaseReady = true;
    console.log("🔥 Firebase inicializado correctamente en el módulo de transporte.");
  }
} catch (err) {
  console.warn("⚠️ No se pudo conectar a Firebase, utilizando modo local fallback:", err);
}

/**
 * Suscribirse a los datos en tiempo real de la base de datos
 * @param {Function} callback Callback que recibe { guests, zoneOptions, settings, destination }
 */
function suscribirDatosFirebase(callback) {
  if (!isFirebaseReady || !db) return false;
  
  const ref = db.ref("transporteData");
  ref.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data && typeof callback === "function") {
      callback(data);
    }
  }, (error) => {
    console.error("Error al escuchar Firebase Realtime Database:", error);
  });
  
  return true;
}

/**
 * Guardar estado completo en Firebase Realtime Database
 * @param {Object} dataObjeto { guests, zoneOptions, settings, destination }
 */
async function guardarDatosFirebase(dataObjeto) {
  if (!isFirebaseReady || !db) return false;
  try {
    await db.ref("transporteData").set(dataObjeto);
    return true;
  } catch (err) {
    console.error("Error al guardar en Firebase:", err);
    return false;
  }
}
