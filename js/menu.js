
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
    let jsonData;
    try {
      jsonData = await fetch('http://localhost:3000/api/productos');
      if (!jsonData.ok) throw new Error('Error al conectar con la base de datos');
    } catch (apiError) {
      console.warn('Servidor local de Express no disponible, usando respaldo JSON:', apiError);
      jsonData = await fetch('../data/menu.json');
    }

    if (!jsonData.ok) {
      throw new Error('No se pudo cargar el menu!');
    }

    menuCafeteria = await jsonData.json();

    menuCafeteria.forEach((item, index) => {
      if (!item.id) {
        item.id = index + 1;
      }
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

function crearTarjetaHtml(item) {
  const unidadTexto = item.unidad_medida ? ` / ${item.unidad_medida}` : '';
  return `
    <a href="producto.html?id=${item.id}" class="tarjeta block max-w-sm rounded overflow-hidden shadow-lg relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10 cursor-pointer">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-base">${item.descripcion}</p>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${item.precio}${unidadTexto}</span>
      </div>
    </a>
  `;
}

function rellenarCompleto() {
  contenedorTarjetas.innerHTML = menuCafeteria.map(crearTarjetaHtml).join('');
}

function rellenarFiltrado(resultados) {
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

busquedaInput.addEventListener('input', filtrar);

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

cargarMenu();
