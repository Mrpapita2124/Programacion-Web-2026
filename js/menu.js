
import { iniciarBotonTema } from './botonTema.js';
import { iniciarMenuDesplegable } from './menuDesplegable.js';
import { obtenerProductos } from './api.js';
import { iniciarSugerenciasBusqueda } from './buscadorSugerencias.js';

iniciarBotonTema();
iniciarMenuDesplegable();

const contenedorTarjetas = document.querySelector('#contenedor-tarjetas');
const busquedaInput = document.querySelector("#busqueda");
const botones = document.querySelectorAll('#nav button[data-categoria]');
const navFiltros = document.querySelector('#nav');
const btnAbrirFiltros = document.querySelector('#btn-abrir-filtros');
const btnCerrarFiltros = document.querySelector('#btn-cerrar-filtros');
const filtrosBackdrop = document.querySelector('#filtros-backdrop');

function abrirFiltros() {
  navFiltros.classList.remove('translate-y-full');
  filtrosBackdrop.classList.remove('hidden');
}

function cerrarFiltros() {
  navFiltros.classList.add('translate-y-full');
  filtrosBackdrop.classList.add('hidden');
}

btnAbrirFiltros.addEventListener('click', abrirFiltros);
btnCerrarFiltros.addEventListener('click', cerrarFiltros);
filtrosBackdrop.addEventListener('click', cerrarFiltros);

let menuCafeteria = [];
let categoriaActual = 'todas';

async function cargarMenu() {
  contenedorTarjetas.innerHTML = '<p class="text-center w-full">Cargando menu...</p>';

  try {
    menuCafeteria = await obtenerProductos();
    filtrar();
  }
  catch (error) {
    console.error(error);

    contenedorTarjetas.innerHTML = `
      <p class="text-center text-red-500 w-full">
        No se pudo cargar el menu. Intenta nuevamente.
      </p>
    `;
  }
}

function crearTarjetaHtml(item) {
  const unidadTexto = item.unidad_medida ? ` / ${item.unidad_medida}` : '';
  return `
    <a href="producto.html?id=${item.id}" class="tarjeta block rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10 cursor-pointer">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="p-3 sm:px-6 sm:py-4">
        <div class="font-bold text-sm sm:text-xl mb-1 sm:mb-2 truncate">${item.nombre}</div>
        <p class="text-xs sm:text-base opacity-85 mb-2 line-clamp-2">${item.descripcion}</p>
        <span class="precio-badge inline-block rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold">$${item.precio}${unidadTexto}</span>
      </div>
    </a>
  `;
}

function rellenarCompleto() {
  contenedorTarjetas.innerHTML = menuCafeteria.map(crearTarjetaHtml).join('');
}

function rellenarFiltrado(resultados) {
  if (resultados.length === 0) {
    contenedorTarjetas.innerHTML = '<p class="col-span-full text-center text-lg opacity-75 py-12">No se encontraron productos que coincidan con tu búsqueda.</p>';
    return;
  }
  contenedorTarjetas.innerHTML = resultados.map(crearTarjetaHtml).join('');
}

function filtrar() {
  const texto = busquedaInput.value.toLowerCase().trim();

  if (categoriaActual === 'todas' && texto === '') {
    rellenarCompleto();
    return;
  }

  const resultados = menuCafeteria.filter(item => {
    const coincideCategoria = categoriaActual === 'todas' || normalizar(item.categoria) === normalizar(categoriaActual);

    const coincideNombre = item.nombre.toLowerCase().includes(texto);
    const coincideDescripcion = item.descripcion.toLowerCase().includes(texto);

    return coincideCategoria && (coincideNombre || coincideDescripcion);
  });

  rellenarFiltrado(resultados);
}

busquedaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const termino = busquedaInput.value.trim();
    const params = new URLSearchParams();
    if (categoriaActual && categoriaActual !== 'todas') {
      params.set('categoria', categoriaActual);
    }
    if (termino !== '') {
      params.set('busqueda', termino);
    }
    const query = params.toString();
    window.location.href = query ? `busqueda.html?${query}` : 'busqueda.html';
  }
});

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    categoriaActual = boton.dataset.categoria;

    botones.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    filtrar();
  });
});

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const urlParams = new URLSearchParams(window.location.search);
const categoriaURL = urlParams.get('categoria');
const busquedaURL = urlParams.get('busqueda');

if (busquedaURL) {
  busquedaInput.value = busquedaURL;
}

if (categoriaURL) {
  const catBuscada = normalizar(categoriaURL);
  botones.forEach(boton => {
    if (normalizar(boton.dataset.categoria) === catBuscada) {
      categoriaActual = boton.dataset.categoria;
      botones.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
    }
  });
}

iniciarSugerenciasBusqueda(busquedaInput, () => menuCafeteria);

cargarMenu();
