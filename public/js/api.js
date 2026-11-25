const URL_PRODUCTOS_PHP = '../../api/productos.php';
const URL_PEDIDOS_PHP = '../../api/pedidos.php';

function prepararProductos(productos, rutaImagenes = '../assets/img/productos/') {
  return productos.map((item, index) => {
    const copia = { ...item };
    if (!copia.id) {
      copia.id = index + 1;
    }

    const nombreArchivo = copia.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");

    copia.imagen = `${rutaImagenes}${nombreArchivo}.png`;
    return copia;
  });
}

export async function obtenerProductos(rutaImagenes = '../assets/img/productos/') {
  const respuesta = await fetch(URL_PRODUCTOS_PHP);
  const tipo = respuesta.headers.get('content-type') || '';

  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para cargar los productos.');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  }

  if (!Array.isArray(datos)) {
    throw new TypeError('La lista de productos debe ser un arreglo JSON.');
  }

  return prepararProductos(datos, rutaImagenes);
}

export async function obtenerProductoPorId(id, rutaImagenes = '../assets/img/productos/') {
  const respuesta = await fetch(`${URL_PRODUCTOS_PHP}?id=${encodeURIComponent(id)}`);
  const tipo = respuesta.headers.get('content-type') || '';

  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para cargar el producto.');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Producto no encontrado');
  }

  return prepararProductos([datos], rutaImagenes)[0];
}

export async function crearPedido(pedido) {
  const respuesta = await fetch(URL_PEDIDOS_PHP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  });

  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para procesar pedidos.');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo confirmar el pedido');
  }

  return datos;
}

export async function crearProducto(producto, rutaImagenes = '../assets/img/productos/') {
  const respuesta = await fetch(URL_PRODUCTOS_PHP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });

  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para crear productos.');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo crear el producto');
  }

  return prepararProductos([datos], rutaImagenes)[0];
}

export async function actualizarProducto(id, producto, rutaImagenes = '../assets/img/productos/') {
  const respuesta = await fetch(`${URL_PRODUCTOS_PHP}?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });

  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para actualizar productos.');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo actualizar el producto');
  }

  return prepararProductos([datos], rutaImagenes)[0];
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_PRODUCTOS_PHP}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });

  if (respuesta.status === 204) {
    return true;
  }

  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    throw new Error('El servidor PHP no está activo para eliminar productos.');
  }

  const datos = await respuesta.json();
  throw new Error(datos.error || 'No se pudo eliminar el producto');
}
