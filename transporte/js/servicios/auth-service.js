/**
 * Servicio de Autenticación con Firebase Auth
 * Maneja inicio de sesión con Google, Correo/Contraseña y observador de estado.
 */

function normalizarEmail(input) {
  const limpio = (input || "").trim();
  if (!limpio) return "";
  if (limpio.includes("@")) return limpio;
  return `${limpio}@roque50.app`;
}

async function iniciarSesionConGoogle() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    throw new Error("Firebase Auth no está disponible.");
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    return result.user;
  } catch (error) {
    console.error("Error en inicio de sesión con Google:", error);
    throw error;
  }
}

async function iniciarSesionConEmail(userInput, password) {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    throw new Error("Firebase Auth no está disponible.");
  }
  const email = normalizarEmail(userInput);
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

async function registrarUsuarioConEmail(userInput, password) {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    throw new Error("Firebase Auth no está disponible.");
  }
  const email = normalizarEmail(userInput);
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    return result.user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}

async function cerrarSesionUsuario() {
  if (typeof firebase === 'undefined' || !firebase.auth) return;
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

function observarEstadoSesion(callback) {
  if (typeof firebase === 'undefined' || !firebase.auth) return () => {};
  return firebase.auth().onAuthStateChanged((user) => {
    if (typeof callback === 'function') {
      callback(user);
    }
  });
}

function obtenerUsuarioActual() {
  if (typeof firebase === 'undefined' || !firebase.auth) return null;
  return firebase.auth().currentUser;
}
