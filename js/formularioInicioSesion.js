import { validarCorreo, validarContraseña } from './validaciones.js';
import { iniciarBotonTema } from './botonTema.js';

iniciarBotonTema();

const formulario = document.querySelector('.formulario');

function mostrarError(campo, mensaje) {
  const spanError = document.querySelector(`.error-campo[data-error-para="${campo}"]`);
  if (spanError) {
    spanError.textContent = mensaje;
  }
}

if (formulario) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const formData = new FormData(evento.target);

    const email = (formData.get('email') ?? '').trim();
    const password = formData.get('password') ?? '';

    let esValido = true;

    if (!email) {
      mostrarError('email', 'El correo electrónico es obligatorio.');
      esValido = false;
    } else if (!validarCorreo(email)) {
      mostrarError('email', 'Debe tener un formato de correo válido (ej. usuario@dominio.com).');
      esValido = false;
    } else {
      mostrarError('email', '');
    }

    if (!password) {
      mostrarError('password', 'La contraseña es obligatoria.');
      esValido = false;
    } else if (!validarContraseña(password)) {
      mostrarError('password', 'Mínimo 8 caracteres, al menos una letra y un número, sin espacios ni caracteres especiales.');
      esValido = false;
    } else {
      mostrarError('password', '');
    }

    if (esValido) {
      window.location.href = 'menu.html';
    }
  });
}

