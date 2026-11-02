import { validarCorreo, validarTelefono, validarNombre, validarContraseña } from './validaciones.js';
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

    const nombre = (formData.get('nombre') ?? '').trim();
    const apellidos = (formData.get('apellidos') ?? '').trim();
    const email = (formData.get('email') ?? '').trim();
    const password = formData.get('password') ?? '';
    const estado = formData.get('estado') ?? '';
    const telefono = (formData.get('telefono') ?? '').trim();
    const terminos = formData.has('terminos');

    let esValido = true;

    if (!nombre) {
      mostrarError('nombre', 'El nombre es obligatorio.');
      esValido = false;
    } else if (!validarNombre(nombre)) {
      mostrarError('nombre', 'El nombre solo debe contener letras y espacios.');
      esValido = false;
    } else {
      mostrarError('nombre', '');
    }

    if (!apellidos) {
      mostrarError('apellidos', 'Los apellidos son obligatorios.');
      esValido = false;
    } else if (!validarNombre(apellidos)) {
      mostrarError('apellidos', 'Los apellidos solo deben contener letras y espacios.');
      esValido = false;
    } else {
      mostrarError('apellidos', '');
    }

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

    if (!estado || estado === 'Default') {
      mostrarError('estado', 'Debes seleccionar un estado de la lista.');
      esValido = false;
    } else {
      mostrarError('estado', '');
    }

    if (!telefono) {
      mostrarError('telefono', 'El teléfono es obligatorio.');
      esValido = false;
    } else if (!validarTelefono(telefono)) {
      mostrarError('telefono', 'El teléfono debe contener exactamente 10 dígitos numéricos.');
      esValido = false;
    } else {
      mostrarError('telefono', '');
    }

    if (!terminos) {
      mostrarError('terminos', 'Debes aceptar los términos y condiciones.');
      esValido = false;
    } else {
      mostrarError('terminos', '');
    }

    if (esValido) {
      window.location.href = 'formularioInicioSesion.html';
    }
  });
}
