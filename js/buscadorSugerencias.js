function normalizar(texto) {
  return (texto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function iniciarSugerenciasBusqueda(input, obtenerLista) {
  if (!input) return;

  const wrapper = document.createElement('div');
  wrapper.className = input.classList.contains('w-1/2')
    ? 'relative w-1/2'
    : 'relative flex-1 max-w-xl';

  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  input.classList.remove('flex-1', 'max-w-xl', 'w-1/2');
  input.classList.add('w-full');

  const lista = document.createElement('ul');
  lista.className = 'sugerencias-lista hidden absolute left-0 right-0 top-full z-50 rounded-b-xl shadow-2xl border border-t-0 overflow-hidden';
  wrapper.appendChild(lista);

  function ocultar() {
    lista.classList.add('hidden');
    input.classList.remove('rounded-b-none');
  }

  function mostrar() {
    lista.classList.remove('hidden');
    input.classList.add('rounded-b-none');
  }

  function actualizar() {
    if (document.activeElement !== input) {
      ocultar();
      return;
    }

    const texto = normalizar(input.value);
    if (!texto) {
      ocultar();
      return;
    }

    const productos = obtenerLista() || [];
    const coincidencias = productos
      .filter(item =>
        normalizar(item.nombre).includes(texto) ||
        normalizar(item.descripcion).includes(texto)
      )
      .slice(0, 3);

    if (coincidencias.length === 0) {
      lista.innerHTML = '<li class="px-4 py-3 text-sm opacity-75">Sin coincidencias</li>';
      mostrar();
      return;
    }

    lista.innerHTML = coincidencias.map(item => `
      <li>
        <a href="producto.html?id=${item.id}" class="sugerencia-item flex items-center gap-3 px-4 py-2.5 transition">
          <img src="${item.imagen}" alt="${item.nombre}" class="w-10 h-10 object-cover rounded-lg shrink-0">
          <div class="min-w-0 flex-1">
            <div class="font-bold text-sm sm:text-base truncate">${item.nombre}</div>
            <div class="text-xs opacity-75 truncate">${item.categoria}</div>
          </div>
          <span class="text-sm font-bold shrink-0">$${item.precio}</span>
        </a>
      </li>
    `).join('');

    mostrar();
  }

  input.addEventListener('input', actualizar);
  input.addEventListener('focus', actualizar);
  input.addEventListener('blur', () => {
    setTimeout(ocultar, 150);
  });
}
