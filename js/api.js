const API_URL = 'http://localhost:3000/api/productos';

export async function obtenerProductos(rutaRespaldo = '../data/menu.json', rutaImagenes = '../assets/icons/') {
  let respuesta;

  try {
    respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error('Error al conectar con la base de datos');
  } catch (apiError) {
    console.warn('Servidor local de Express no disponible, usando respaldo JSON:', apiError);
    respuesta = await fetch(rutaRespaldo);
  }

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  const productos = await respuesta.json();

  productos.forEach((item, index) => {
    if (!item.id) {
      item.id = index + 1;
    }

    const nombreArchivo = item.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");

    item.imagen = `${rutaImagenes}${nombreArchivo}.png`;
  });

  return productos;
}
