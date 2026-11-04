import { validarCorreo, validarContraseña } from './validaciones.js';
import { iniciarBotonTema } from './botonTema.js';

iniciarBotonTema();

const formulario = document.querySelector('.formulario');

if (formulario) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = Object.fromEntries(
      new FormData(formulario)
    );

    const emailValido = validarCorreo((datos.email ?? '').trim(), 'email');
    const passwordValido = validarContraseña(datos.password ?? '', 'password');



    if (emailValido && passwordValido) {
      window.location.href = 'menu.html';
    }
  });
}
