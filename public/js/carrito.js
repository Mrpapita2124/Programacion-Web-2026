import { guardar, leer } from './storage.js';
import { crearPedido } from './api.js';

const CLAVE_CARRITO = 'cafeteria_carrito';

let carrito = leer(CLAVE_CARRITO, []);
if (!Array.isArray(carrito)) carrito = [];

let obtenerCatalogo = () => [];
let ui = null;

function guardarCarrito() {
  guardar(CLAVE_CARRITO, carrito);
}

function contarItems() {
  return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function calcularTotal(productos) {
  return carrito.reduce((acc, item) => {
    const prod = productos.find(p => p.id === item.id);
    if (!prod) return acc;
    return acc + Number(prod.precio) * item.cantidad;
  }, 0);
}

function crearInterfaz() {
  const boton = document.createElement('button');
  boton.id = 'btn-carrito';
  boton.type = 'button';
  boton.setAttribute('aria-label', 'Abrir carrito de compras');
  boton.className = 'aside-panel fixed bottom-28 right-0 z-50 backdrop-blur-md text-xl sm:text-2xl font-bold py-3 px-3.5 rounded-l-2xl shadow-xl border border-r-0 transition-all duration-300 hover:scale-105 flex items-center gap-2';
  boton.innerHTML = '🛒 <span id="carrito-contador" class="precio-badge text-xs sm:text-sm font-extrabold px-2 py-0.5 rounded-full">0</span>';

  const backdrop = document.createElement('div');
  backdrop.id = 'carrito-backdrop';
  backdrop.className = 'hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40';

  const panel = document.createElement('aside');
  panel.id = 'carrito-panel';
  panel.className = 'aside-panel fixed top-0 right-0 h-screen w-full max-w-md translate-x-full transition-transform duration-300 z-50 shadow-2xl border-l flex flex-col';
  panel.innerHTML = `
    <div class="flex items-center justify-between px-5 py-4 border-b borde-suave">
      <h2 class="text-xl font-bold">Tu Carrito</h2>
      <button type="button" id="btn-cerrar-carrito" class="px-3 py-1 rounded-lg font-bold text-sm border borde-suave hover:opacity-75 transition" aria-label="Cerrar carrito">✕</button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <p id="carrito-vacio" class="text-center opacity-75 py-12">Tu carrito está vacío.</p>
      <ul id="carrito-lista" class="flex flex-col gap-3"></ul>
    </div>

    <div class="p-4 border-t borde-suave flex flex-col gap-3">
      <div class="flex items-center justify-between text-lg font-extrabold">
        <span>Total:</span>
        <span id="carrito-total">$0.00</span>
      </div>

      <form id="form-pedido" class="flex flex-col gap-2.5" novalidate>
        <div>
          <input type="text" name="nombre" placeholder="Nombre para el pedido (mín. 3 letras)"
            class="w-full rounded-xl px-3 py-2 text-sm border borde-suave bg-white text-stone-900 focus:outline-none">
          <span class="error-campo text-xs block mt-1" data-error-para="nombre"></span>
        </div>
        <input type="text" name="notas" placeholder="Notas opcionales (ej. sin azúcar)"
          class="w-full rounded-xl px-3 py-2 text-sm border borde-suave bg-white text-stone-900 focus:outline-none">
        <p id="carrito-mensaje" class="text-xs font-semibold hidden"></p>
        <button type="submit" id="btn-confirmar-pedido"
          class="btn-ver-mas w-full py-2.5 rounded-xl font-bold text-sm sm:text-base transition-colors duration-300">
          Confirmar pedido
        </button>
      </form>
    </div>
  `;

  document.body.append(boton, backdrop, panel);

  return {
    boton,
    backdrop,
    panel,
    contador: boton.querySelector('#carrito-contador'),
    cerrarBtn: panel.querySelector('#btn-cerrar-carrito'),
    vacio: panel.querySelector('#carrito-vacio'),
    lista: panel.querySelector('#carrito-lista'),
    total: panel.querySelector('#carrito-total'),
    form: panel.querySelector('#form-pedido'),
    mensaje: panel.querySelector('#carrito-mensaje')
  };
}

function abrirPanel() {
  if (!ui) return;
  renderizarCarrito();
  ui.panel.classList.remove('translate-x-full');
  ui.backdrop.classList.remove('hidden');
}

function cerrarPanel() {
  if (!ui) return;
  ui.panel.classList.add('translate-x-full');
  ui.backdrop.classList.add('hidden');
}

function mostrarMensajeCarrito(texto, esError = false) {
  if (!ui) return;
  ui.mensaje.textContent = texto;
  ui.mensaje.classList.remove('hidden');
  ui.mensaje.style.color = esError ? 'var(--error_texto)' : 'var(--selecionado)';
}

export function renderizarCarrito() {
  if (!ui) return;

  const productos = obtenerCatalogo() || [];
  ui.contador.textContent = contarItems();

  if (productos.length === 0 && carrito.length > 0) {
    ui.vacio.classList.add('hidden');
    return;
  }

  const filas = carrito.map(item => {
    const prod = productos.find(p => p.id === item.id);
    if (!prod) return '';
    const subtotal = (Number(prod.precio) * item.cantidad).toFixed(2);
    const alLimite = prod.disponibles !== undefined && item.cantidad >= prod.disponibles;

    return `
      <li class="mini-tarjeta flex items-center gap-3 p-3 rounded-xl border borde-suave" data-carrito-id="${item.id}">
        <img src="${prod.imagen}" alt="${prod.nombre}" class="w-14 h-14 object-cover rounded-lg shrink-0">
        <div class="min-w-0 flex-1">
          <div class="font-bold text-sm truncate">${prod.nombre}</div>
          <div class="text-xs opacity-75">$${prod.precio} c/u · Subtotal: $${subtotal}</div>
          <div class="flex items-center gap-2 mt-2">
            <button type="button" data-accion="menos" class="w-7 h-7 rounded-lg border borde-suave font-bold hover:opacity-75">-</button>
            <span class="text-sm font-bold min-w-[20px] text-center">${item.cantidad}</span>
            <button type="button" data-accion="mas" ${alLimite ? 'disabled' : ''} class="w-7 h-7 rounded-lg border borde-suave font-bold hover:opacity-75 disabled:opacity-40">+</button>
          </div>
        </div>
        <button type="button" data-accion="quitar" class="px-2 py-1 text-sm font-bold opacity-70 hover:opacity-100" aria-label="Quitar producto">✕</button>
      </li>
    `;
  }).filter(Boolean);

  ui.lista.innerHTML = filas.join('');
  ui.vacio.classList.toggle('hidden', filas.length > 0);
  ui.total.textContent = `$${calcularTotal(productos).toFixed(2)}`;
}

export function agregarAlCarrito(id, cantidad = 1) {
  const productos = obtenerCatalogo() || [];
  const prod = productos.find(p => p.id === Number(id));
  if (!prod) return;

  if (prod.disponibles !== undefined && prod.disponibles <= 0) {
    return;
  }

  const existente = carrito.find(item => item.id === prod.id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;

  if (prod.disponibles !== undefined && nuevaCantidad > prod.disponibles) {
    if (existente) {
      existente.cantidad = prod.disponibles;
    } else {
      carrito.push({ id: prod.id, cantidad: prod.disponibles });
    }
  } else if (existente) {
    existente.cantidad = nuevaCantidad;
  } else {
    carrito.push({ id: prod.id, cantidad });
  }

  guardarCarrito();
  renderizarCarrito();
}

function cambiarCantidad(id, delta) {
  const productos = obtenerCatalogo() || [];
  const prod = productos.find(p => p.id === id);

  carrito = carrito
    .map(item => {
      if (item.id !== id) return item;
      let nueva = item.cantidad + delta;
      if (prod && prod.disponibles !== undefined && nueva > prod.disponibles) {
        nueva = prod.disponibles;
      }
      return { ...item, cantidad: nueva };
    })
    .filter(item => item.cantidad > 0);

  guardarCarrito();
  renderizarCarrito();
}

export function iniciarCarrito(obtenerLista) {
  obtenerCatalogo = obtenerLista;
  if (!ui) {
    ui = crearInterfaz();

    ui.boton.addEventListener('click', abrirPanel);
    ui.cerrarBtn.addEventListener('click', cerrarPanel);
    ui.backdrop.addEventListener('click', cerrarPanel);

    ui.lista.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-accion]');
      if (!btn) return;
      const fila = btn.closest('[data-carrito-id]');
      if (!fila) return;
      const id = Number(fila.dataset.carritoId);
      const accion = btn.dataset.accion;

      if (accion === 'mas') cambiarCantidad(id, 1);
      if (accion === 'menos') cambiarCantidad(id, -1);
      if (accion === 'quitar') {
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito();
        renderizarCarrito();
      }
    });

    ui.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorNombre = ui.form.querySelector('[data-error-para="nombre"]');
      errorNombre.textContent = '';
      ui.mensaje.classList.add('hidden');

      const datos = new FormData(ui.form);
      const nombre = String(datos.get('nombre') || '').trim();
      const notas = String(datos.get('notas') || '').trim();

      if (nombre.length < 3) {
        errorNombre.textContent = 'Ingresa tu nombre (mínimo 3 caracteres).';
        return;
      }

      if (carrito.length === 0) {
        mostrarMensajeCarrito('Agrega al menos un producto antes de confirmar.', true);
        return;
      }

      try {
        const pedido = await crearPedido({ nombre, notas, items: carrito });
        carrito = [];
        guardarCarrito();
        ui.form.reset();
        renderizarCarrito();
        mostrarMensajeCarrito(`¡Pedido #${pedido.id} confirmado! Total: $${Number(pedido.total).toFixed(2)}`);
      } catch (error) {
        mostrarMensajeCarrito(error.message || 'No se pudo procesar el pedido.', true);
      }
    });
  }

  renderizarCarrito();
}
