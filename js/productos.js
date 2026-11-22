import { iniciarBotonTema } from './botonTema.js';
import { iniciarMenuDesplegable } from './menuDesplegable.js';
import { obtenerProductos } from './api.js';
import { iniciarSugerenciasBusqueda } from './buscadorSugerencias.js';

iniciarBotonTema();
iniciarMenuDesplegable();

const gridCategorias = document.querySelector('#grid-categorias');
const seccionesCategorias = document.querySelector('#secciones-categorias');
const busquedaInput = document.querySelector('#busqueda');

let listaProductos = [];

const categoriasConfig = [
  { key: 'calientes', titulo: 'Bebidas Calientes', subtitulo: 'Café recién hecho para cada momento' },
  { key: 'bebidas frías', titulo: 'Bebidas Frías', subtitulo: 'Opciones refrescantes y frappés' },
  { key: 'postres', titulo: 'Postres', subtitulo: 'Recién horneados para acompañar' },
  { key: 'extras', titulo: 'Extras y Complementos', subtitulo: 'Personaliza tu pedido a tu gusto' }
];

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function crearTarjetaHtml(item) {
  const unidadTexto = item.unidad_medida ? ` / ${item.unidad_medida}` : '';
  return `
    <a href="producto.html?id=${item.id}" class="tarjeta block rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10 cursor-pointer">
      <img class="w-full" src="${item.imagen}" alt="${item.nombre}">
      <div class="p-3 sm:px-5 sm:py-4">
        <div class="font-bold text-sm sm:text-xl mb-1 sm:mb-1.5 truncate">${item.nombre}</div>
        <p class="text-xs sm:text-base opacity-85 mb-2 sm:mb-3 line-clamp-2">${item.descripcion}</p>
        <span class="precio-badge inline-block rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold">$${item.precio}${unidadTexto}</span>
      </div>
    </a>
  `;
}

function mezclarProductos(productos) {
  const copia = [...productos];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearMiniTarjetaHtml(item) {
  return `
    <a href="producto.html?id=${item.id}" class="mini-tarjeta group flex flex-col gap-2 p-2 rounded-xl transition">
      <div class="aspect-square w-full overflow-hidden rounded-lg">
        <img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
      </div>
      <span class="text-sm sm:text-base font-bold truncate">${item.nombre}</span>
    </a>
  `;
}

function renderizarCajasCategoria(productos) {
  const aleatorios = mezclarProductos(productos);
  const masVendidos = aleatorios.slice(0, 12);
  const nuevasAdiciones = aleatorios.slice(12, 16);

  gridCategorias.innerHTML = `
    <div class="tarjeta sm:col-span-2 lg:col-span-3 rounded-2xl shadow-xl p-5 border">
      <h2 class="text-xl sm:text-2xl font-bold mb-4">Los más vendidos</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        ${masVendidos.map(crearMiniTarjetaHtml).join('')}
      </div>
    </div>

    <div class="tarjeta sm:col-span-2 lg:col-span-1 rounded-2xl shadow-xl p-5 border">
      <h2 class="text-xl sm:text-2xl font-bold mb-4">Nuevas adiciones</h2>
      <div class="grid grid-cols-2 gap-3">
        ${nuevasAdiciones.map(crearMiniTarjetaHtml).join('')}
      </div>
    </div>
  `;
}

function renderizarEstanterias(productos) {
  seccionesCategorias.innerHTML = categoriasConfig.map(cat => {
    const itemsCat = productos.filter(p => normalizar(p.categoria) === normalizar(cat.key)).slice(0, 4);
    if (itemsCat.length === 0) return '';

    return `
      <div class="estanteria rounded-2xl p-5 sm:p-7 shadow-md border">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold">${cat.titulo}</h2>
            <p class="text-sm opacity-75">${cat.subtitulo}</p>
          </div>
          <a href="busqueda.html?categoria=${encodeURIComponent(cat.key)}" class="btn-ver-mas text-sm sm:text-base font-bold px-4 py-2 rounded-xl transition-colors duration-300">
            Ver más →
          </a>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          ${itemsCat.map(crearTarjetaHtml).join('')}
        </div>
      </div>
    `;
  }).join('');
}

async function cargarTienda() {
  try {
    const productos = await obtenerProductos();
    listaProductos = productos;

    renderizarCajasCategoria(productos);
    renderizarEstanterias(productos);
  } catch (error) {
    console.error(error);
    gridCategorias.innerHTML = '<p class="col-span-full text-center text-red-500 py-8">No se pudieron cargar los productos.</p>';
  }
}

if (busquedaInput) {
  busquedaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const termino = busquedaInput.value.trim();
      window.location.href = termino
        ? `busqueda.html?busqueda=${encodeURIComponent(termino)}`
        : 'busqueda.html';
    }
  });
}

iniciarSugerenciasBusqueda(busquedaInput, () => listaProductos);

cargarTienda();
