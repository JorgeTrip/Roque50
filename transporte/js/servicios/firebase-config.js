/**
 * Configuración e inicialización de Firebase SDK para el módulo de Transporte
 * Proyecto: transporte-47fe6
 * Soporta almacenamiento aislado por UID de usuario.
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

let app = null;
let db = null;
let isFirebaseReady = false;

try {
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    isFirebaseReady = true;
    console.log("🔥 Firebase inicializado correctamente.");
  }
} catch (err) {
  console.warn("⚠️ No se pudo conectar a Firebase:", err);
}

function suscribirDatosFirebase(uid, callback) {
  if (!isFirebaseReady || !db || !uid) return false;
  
  const ref = db.ref(`usersData/${uid}/transporteData`);
  ref.on("value", (snapshot) => {
    const data = snapshot.val();
    if (typeof callback === "function") {
      callback(data);
    }
  }, (error) => {
    console.error("Error al escuchar Firebase Realtime Database:", error);
  });
  
  return true;
}

async function guardarDatosFirebase(uid, dataObjeto) {
  if (!isFirebaseReady || !db || !uid) return false;
  try {
    await db.ref(`usersData/${uid}/transporteData`).set(dataObjeto);
    return true;
  } catch (err) {
    console.error("Error al guardar en Firebase:", err);
    return false;
  }
}

async function inicializarUsuarioFirebase(user, callback) {
  if (!isFirebaseReady || !db || !user || !user.uid) return;

  const userRef = db.ref(`usersData/${user.uid}/transporteData`);
  const snapshot = await userRef.once("value");
  const userData = snapshot.val();

  if (!userData) {
    const isJorge = user.email && user.email.toLowerCase() === "jorgeotripodi@gmail.com";
    if (isJorge) {
      const legacySnap = await db.ref("transporteData").once("value");
      const legacyData = legacySnap.val();
      if (legacyData) {
        await userRef.set(legacyData);
        console.log("📦 Datos actuales de Roque 50 migrados exitosamente a la cuenta de Jorge.");
      }
    }
  }

  suscribirDatosFirebase(user.uid, callback);
}
