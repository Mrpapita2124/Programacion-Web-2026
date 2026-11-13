
import { iniciarBotonTema } from './botonTema.js';

iniciarBotonTema();

const contenedorTarjetas = document.querySelector('#contenedor-tarjetas');
const busquedaInput = document.querySelector("#busqueda");
const botones = document.querySelectorAll('#nav button');

let menuCafeteria = [];
let categoriaActual = 'todas';

async function cargarMenu() {
  contenedorTarjetas.innerHTML = '<p class="text-center w-full">Cargando menu...</p>';

  try {
    const jsonData = await fetch('../data/menu.json');

    if (!jsonData.ok) {
      throw new Error('No se pudo cargar el menu!');
    }

    menuCafeteria = await jsonData.json();

    menuCafeteria.forEach(item => {
      const nombreArchivo = item.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");

      item.imagen = `../assets/icons/${nombreArchivo}.png`;
    });

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

function rellenarCompleto() {
  let resultadosHtml = menuCafeteria.map(item => {
    return `
    <div class="tarjeta max-w-sm rounded overflow-hidden shadow-lg">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-base">${item.descripcion}</p>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${item.precio}</span>
      </div>
    </div>
  `}).join('');

  contenedorTarjetas.innerHTML = resultadosHtml;
}

function rellenarFiltrado(resultados) {
  let resultadosHtml = resultados.map(item => {
    return `<div class="tarjeta max-w-sm rounded overflow-hidden shadow-lg">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-base">${item.descripcion}</p>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${item.precio}</span>
      </div>
    </div>
  `}).join('');

  contenedorTarjetas.innerHTML = resultadosHtml;
}

function filtrar() {
  const texto = busquedaInput.value.toLowerCase().trim();

  if (categoriaActual === 'todas' && texto === '') {
    rellenarCompleto();
    return;
  }

  const resultados = menuCafeteria.filter(item => {
    const coincideCategoria = categoriaActual === 'todas' || item.categoria === categoriaActual;

    const coincideNombre = item.nombre.toLowerCase().includes(texto);
    const coincideDescripcion = item.descripcion.toLowerCase().includes(texto);

    return coincideCategoria && (coincideNombre || coincideDescripcion);
  });

  rellenarFiltrado(resultados);
}

busquedaInput.addEventListener('input', filtrar);

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    categoriaActual = boton.dataset.categoria;

    botones.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    filtrar();
  });
});

cargarMenu();
