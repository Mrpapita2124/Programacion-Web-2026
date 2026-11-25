import { iniciarBotonTema } from './botonTema.js';
import { obtenerProductos } from './api.js';
import { iniciarSugerenciasBusqueda } from './buscadorSugerencias.js';
import { iniciarCarrito, agregarAlCarrito, renderizarCarrito } from './carrito.js';

iniciarBotonTema();

const contenedorProducto = document.querySelector('#contenedor-producto');
const contenedorRecomendaciones = document.querySelector('#contenedor-recomendaciones');
const busquedaInput = document.querySelector("#busqueda");

let menuCafeteria = [];

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function crearTarjetaHtml(item) {
  const unidadTexto = item.unidad_medida ? ` / ${item.unidad_medida}` : '';
  const agotado = item.disponibles !== undefined && item.disponibles <= 0;
  return `
    <a href="producto.html?id=${item.id}" class="tarjeta block max-w-sm rounded overflow-hidden shadow-lg relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10 cursor-pointer">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-base">${item.descripcion}</p>
        <div class="flex flex-wrap items-center justify-between gap-2 mt-3">
          <span class="precio-badge inline-block rounded-full px-3 py-1 text-sm font-semibold">$${item.precio}${unidadTexto}</span>
          <button type="button" data-agregar-id="${item.id}" ${agotado ? 'disabled' : ''}
            class="btn-ver-mas px-3 py-1 rounded-lg text-xs font-bold transition disabled:opacity-45 disabled:cursor-not-allowed">
            ${agotado ? 'Agotado' : '+ Agregar'}
          </button>
        </div>
      </div>
    </a>
  `;
}

function renderizarProducto(item) {
  const unidadTexto = item.unidad_medida ? ` / ${item.unidad_medida}` : '';
  const descripcionLarga = item.descripcion_larga || item.descripcion;
  const agotado = item.disponibles !== undefined && item.disponibles <= 0;
  const textoStock = agotado ? 'Agotado' : `Disponibles: ${item.disponibles}`;
  contenedorProducto.innerHTML = `
    <div class="tarjeta rounded-2xl overflow-hidden shadow-xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div class="w-full md:w-1/2 flex justify-center">
        <img src="${item.imagen}" alt="${item.nombre}" class="h-72 sm:h-80 md:h-96 w-auto max-w-full object-contain rounded-xl drop-shadow-md">
      </div>
      <div class="w-full md:w-1/2 flex flex-col items-start gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="categoria-badge inline-block font-semibold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
            ${item.categoria}
          </span>
          <span class="precio-badge inline-block font-semibold text-xs px-3 py-1.5 rounded-full">
            ${textoStock}
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold">${item.nombre}</h1>
        <p class="text-base sm:text-lg opacity-90 leading-relaxed">${descripcionLarga}</p>
        <div class="mt-4 flex flex-wrap items-center gap-4">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl sm:text-4xl font-extrabold">$${item.precio}</span>
            <span class="text-base sm:text-lg opacity-75 font-semibold">${unidadTexto}</span>
          </div>
          <button type="button" id="btn-agregar-producto" data-agregar-id="${item.id}" ${agotado ? 'disabled' : ''}
            class="btn-ver-mas px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md transition disabled:opacity-45 disabled:cursor-not-allowed">
            ${agotado ? 'Sin disponibilidad' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.title = `${item.nombre} - 40-20 Café`;
}

function renderizarRecomendaciones(productoActual) {
  const catActual = normalizar(productoActual.categoria);
  let recomendaciones = menuCafeteria.filter(item => 
    normalizar(item.categoria) === catActual && item.id !== productoActual.id
  );

  if (recomendaciones.length === 0) {
    recomendaciones = menuCafeteria.filter(item => item.id !== productoActual.id).slice(0, 4);
  }

  const subtitulo = document.querySelector('#subtitulo-recomendaciones');
  if (subtitulo) {
    subtitulo.textContent = `Otras opciones en ${productoActual.categoria}`;
  }

  contenedorRecomendaciones.innerHTML = recomendaciones.map(crearTarjetaHtml).join('');
}

async function cargarProducto() {
  contenedorProducto.innerHTML = '<p class="text-center w-full py-12">Cargando producto...</p>';

  try {
    menuCafeteria = await obtenerProductos();
    renderizarCarrito();

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = parseInt(urlParams.get('id'), 10);
    const productoActual = menuCafeteria.find(p => p.id === idParam) || menuCafeteria[0];

    renderizarProducto(productoActual);
    renderizarRecomendaciones(productoActual);

  } catch (error) {
    console.error(error);
    contenedorProducto.innerHTML = `
      <p class="text-center text-red-500 w-full py-12">
        No se pudo cargar la información del producto. Intenta nuevamente.
      </p>
    `;
  }
}

if (busquedaInput) {
  busquedaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && busquedaInput.value.trim() !== '') {
      window.location.href = `busqueda.html?busqueda=${encodeURIComponent(busquedaInput.value.trim())}`;
    }
  });
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-agregar-id]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  agregarAlCarrito(btn.dataset.agregarId);
});

iniciarSugerenciasBusqueda(busquedaInput, () => menuCafeteria);
iniciarCarrito(() => menuCafeteria);

cargarProducto();
