/**
 * Controlador de Interfaz de Usuario para Autenticación y Avatar de Usuario
 * Gestiona el modal de login/registro, avatar en header y menú desplegable.
 */

let authMode = "login";

function traducirErrorAuth(error) {
  if (!error || !error.code) return error?.message || "Ocurrió un error inesperado.";
  switch (error.code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Usuario o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Este usuario o correo ya se encuentra registrado.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "Se cerró la ventana de inicio de sesión de Google.";
    case "auth/operation-not-supported-in-this-environment":
      return "⚠️ Firebase requiere un servidor local. Ejecutá 'Iniciar.bat' y abrí http://localhost:8080/transporte/index.html (no funciona directamente con file://).";
    case "auth/configuration-not-found":
      return "⚠️ El proveedor de Google no está activado en Firebase Console. Activalo en Authentication > Sign-in method.";
    default:
      return "Error al autenticar: " + (error.message || "Intente nuevamente.");
  }
}

function mostrarErrorAuth(mensaje) {
  const errEl = document.getElementById("authErrorMsg");
  if (!errEl) return;
  if (mensaje) {
    errEl.textContent = mensaje; errEl.classList.add("show");
  } else {
    errEl.textContent = ""; errEl.classList.remove("show");
  }
}

function cambiarPestanaAuth(modo) {
  authMode = modo;
  mostrarErrorAuth(null);
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const btnSubmit = document.getElementById("btnAuthSubmit");

  if (modo === "login") {
    tabLogin?.classList.add("active"); tabRegister?.classList.remove("active");
    if (btnSubmit) btnSubmit.textContent = "Iniciar Sesión";
  } else {
    tabRegister?.classList.add("active"); tabLogin?.classList.remove("active");
    if (btnSubmit) btnSubmit.textContent = "Crear Cuenta";
  }
}

function obtenerPrimerNombre(user) {
  if (!user) return "Usuario";
  if (user.displayName) {
    const partes = user.displayName.trim().split(" ");
    return partes[0] || "Usuario";
  }
  if (user.email) {
    const usuarioEmail = user.email.split("@")[0];
    return usuarioEmail.charAt(0).toUpperCase() + usuarioEmail.slice(1);
  }
  return "Usuario";
}

function actualizarHeaderUsuario(user) {
  let userWrap = document.getElementById("userAvatarMenuWrap");
  const headerInner = document.querySelector(".header-inner") || document.querySelector("header");

  if (!user) {
    if (userWrap) userWrap.remove();
    return;
  }

  const primerNombre = obtenerPrimerNombre(user);

  if (!userWrap && headerInner) {
    userWrap = document.createElement("div");
    userWrap.id = "userAvatarMenuWrap";
    userWrap.className = "user-avatar-wrap";
    headerInner.appendChild(userWrap);
  }

  const fotoHtml = user.photoURL 
    ? `<img src="${user.photoURL}" alt="Avatar" class="user-avatar-img">`
    : `<div class="user-avatar-initial">${primerNombre.charAt(0).toUpperCase()}</div>`;

  userWrap.innerHTML = `
    <button type="button" class="user-avatar-btn" id="userAvatarBtn" title="Menú de usuario">
      ${fotoHtml}
      <span class="user-greeting">¡Hola ${primerNombre}!</span>
      <span class="user-chevron">▾</span>
    </button>
  `;

  const dropdown = document.getElementById("menuDropdown");
  if (dropdown) {
    userWrap.appendChild(dropdown);

    if (!document.getElementById("logoutMenuItem")) {
      const logoutBtn = document.createElement("button");
      logoutBtn.className = "menu-item menu-logout";
      logoutBtn.id = "logoutMenuItem";
      logoutBtn.innerHTML = "🚪 Cerrar sesión";
      logoutBtn.addEventListener("click", async () => {
        dropdown.classList.remove("open");
        await cerrarSesionUsuario();
      });
      dropdown.appendChild(logoutBtn);
    }
  }

  const avatarBtn = document.getElementById("userAvatarBtn");
  if (avatarBtn && dropdown) {
    avatarBtn.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    };
  }
}

function toggleVistaAutenticada(user) {
  const overlay = document.getElementById("authOverlay");
  const mainWrap = document.getElementById("mainAppWrap");

  actualizarHeaderUsuario(user);

  if (user) {
    overlay?.classList.add("hidden");
    if (mainWrap) mainWrap.style.display = "block";
  } else {
    overlay?.classList.remove("hidden");
    if (mainWrap) mainWrap.style.display = "none";
  }
}

function initAuthUI() {
  document.getElementById("tabLogin")?.addEventListener("click", () => cambiarPestanaAuth("login"));
  document.getElementById("tabRegister")?.addEventListener("click", () => cambiarPestanaAuth("register"));

  if (window.location.protocol === "file:") {
    mostrarErrorAuth("⚠️ Abrí http://localhost:8080/transporte/index.html ejecutando 'Iniciar.bat' para usar la autenticación.");
  }

  document.addEventListener("click", (e) => {
    const userWrap = document.getElementById("userAvatarMenuWrap");
    const dropdown = document.getElementById("menuDropdown");
    if (dropdown && dropdown.classList.contains("open")) {
      if (!userWrap || !userWrap.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    }
  });

  document.getElementById("btnGoogleAuth")?.addEventListener("click", async () => {
    mostrarErrorAuth(null);
    try {
      await iniciarSesionConGoogle();
    } catch (err) {
      mostrarErrorAuth(traducirErrorAuth(err));
    }
  });

  document.getElementById("authForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    mostrarErrorAuth(null);
    const userInp = document.getElementById("authUserInput")?.value;
    const passInp = document.getElementById("authPassInput")?.value;

    if (!userInp || !passInp) {
      mostrarErrorAuth("Por favor, completá todos los campos.");
      return;
    }

    try {
      if (authMode === "login") {
        await iniciarSesionConEmail(userInp, passInp);
      } else {
        await registrarUsuarioConEmail(userInp, passInp);
      }
    } catch (err) {
      mostrarErrorAuth(traducirErrorAuth(err));
    }
  });
}

document.addEventListener("DOMContentLoaded", initAuthUI);
