import {
  validarNombre,
  validarCorreo,
  validarContraseña,
  validarTelefono,
  validarEstado,
  validarTerminos
} from './validaciones.js';
import { iniciarBotonTema } from './botonTema.js';

iniciarBotonTema();

const formulario = document.querySelector('.formulario');

if (formulario) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = Object.fromEntries(
      new FormData(formulario)
    );

    const nombreValido = validarNombre((datos.nombre ?? '').trim(), 'nombre');
    const apellidosValidos = validarNombre((datos.apellidos ?? '').trim(), 'apellidos');
    const emailValido = validarCorreo((datos.email ?? '').trim(), 'email');
    const passwordValido = validarContraseña(datos.password ?? '', 'password');
    const estadoValido = validarEstado(datos.estado ?? '', 'estado');
    const telefonoValido = validarTelefono((datos.telefono ?? '').trim(), 'telefono');
    const terminosValidos = validarTerminos(Boolean(datos.terminos), 'terminos');

    if (nombreValido && apellidosValidos && emailValido && passwordValido && estadoValido && telefonoValido && terminosValidos) {
      window.location.href = 'formularioInicioSesion.html';
    }
  });
}
