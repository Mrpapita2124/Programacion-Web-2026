import { iniciarBotonTema } from './botonTema.js';
import { iniciarMenuDesplegable } from './menuDesplegable.js';

iniciarBotonTema();
iniciarMenuDesplegable();

Swal.fire({
          title: '¡Bienvenido a 40-20 Café!',
          text: 'SweetAlert2 está funcionando correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
});

