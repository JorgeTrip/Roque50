/**
 * Servicio de Autenticación con Firebase Auth
 * Maneja inicio de sesión con Google, Correo/Contraseña y observador de estado.
 */

// Normalizar usuario o email
function normalizarEmail(input) {
  const limpio = (input || "").trim();
  if (!limpio) return "";
  if (limpio.includes("@")) return limpio;
  return `${limpio}@roque50.app`;
}

/**
 * Iniciar sesión con cuenta de Google
 */
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

/**
 * Iniciar sesión con email o usuario y contraseña
 */
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

/**
 * Registrar nuevo usuario con email o usuario y contraseña
 */
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

/**
 * Cerrar la sesión actual
 */
async function cerrarSesionUsuario() {
  if (typeof firebase === 'undefined' || !firebase.auth) return;
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

/**
 * Escuchar cambios en el estado de autenticación de Firebase
 * @param {Function} callback Callback que recibe (user)
 */
function observarEstadoSesion(callback) {
  if (typeof firebase === 'undefined' || !firebase.auth) return () => {};
  return firebase.auth().onAuthStateChanged((user) => {
    if (typeof callback === 'function') {
      callback(user);
    }
  });
}

/**
 * Obtener el usuario autenticado actualmente
 */
function obtenerUsuarioActual() {
  if (typeof firebase === 'undefined' || !firebase.auth) return null;
  return firebase.auth().currentUser;
}
