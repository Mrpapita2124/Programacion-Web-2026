const menuCafeteria = [
  {
    nombre: "Coldbrew",
    categoria: "bebidas frías",
    precio: 50,
    descripcion: "concentrado fuerte de café en frio"
  },
  {
    nombre: "Frapucchino",
    categoria: "bebidas frías",
    precio: 80,
    descripcion: "capucchino frio con mucho hielo"
  },
  {
    nombre: "Limonada",
    categoria: "bebidas frías",
    precio: 35,
    descripcion: "puede ser mineral o natural"
  },
  {
    nombre: "Chai",
    categoria: "bebidas frías",
    precio: 45,
    descripcion: "puede ser en frio o caliente"
  },
  {
    nombre: "Matcha",
    categoria: "bebidas frías",
    precio: 45,
    descripcion: "puede ser en frio o en caliente"
  },

  {
    nombre: "Capucchino",
    categoria: "calientes",
    precio: 70,
    descripcion: "café con leche y mucha espuma"
  },
  {
    nombre: "Latte",
    categoria: "calientes",
    precio: 45,
    descripcion: "café con leche texturizada"
  },
  {
    nombre: "Matcha Latte",
    categoria: "calientes",
    precio: 60,
    descripcion: "matcha con leche texturizada"
  },
  {
    nombre: "Matcha Natural",
    categoria: "calientes",
    precio: 70,
    descripcion: "matcha al natural"
  },
  {
    nombre: "Chai",
    categoria: "calientes",
    precio: 45,
    descripcion: "puede ser en frio o caliente"
  },
  {
    nombre: "Dirty Chai",
    categoria: "calientes",
    precio: 65,
    descripcion: "chai con espresso, puede ser en caliente o frio"
  },
  {
    nombre: "Americano",
    categoria: "calientes",
    precio: 35,
    descripcion: "café rebajado con agua"
  },
  {
    nombre: "Flat White",
    categoria: "calientes",
    precio: 60,
    descripcion: "café con leche sin espumar"
  },
  {
    nombre: "Espresso",
    categoria: "calientes",
    precio: 35,
    descripcion: "extracto puro de café"
  },
  {
    nombre: "Espresso Martini",
    categoria: "calientes",
    precio: 70,
    descripcion: "espresso con vodka"
  },
  {
    nombre: "Espresso Doble",
    categoria: "calientes",
    precio: 55,
    descripcion: "extracto puro de café"
  },
  {
    nombre: "Espresso Maquiato",
    categoria: "calientes",
    precio: 40,
    descripcion: "extracto de café con espuma de leche"
  },

  {
    nombre: "Cupcakes",
    categoria: "postres",
    precio: 35,
    descripcion: "c/u"
  },
  {
    nombre: "Pastel Frio",
    categoria: "postres",
    precio: 40,
    descripcion: "pz"
  },
  {
    nombre: "Pay de Queso",
    categoria: "postres",
    precio: 40,
    descripcion: "pz"
  },
  {
    nombre: "Pan Dulce",
    categoria: "postres",
    precio: 25,
    descripcion: "pz"
  },
  {
    nombre: "Conchas",
    categoria: "postres",
    precio: 25,
    descripcion: "pz"
  },
  {
    nombre: "Flan",
    categoria: "postres",
    precio: 20,
    descripcion: "pz"
  },

  {
    nombre: "Jarabes",
    categoria: "extras",
    precio: 15,
    descripcion: "p/oz"
  },
  {
    nombre: "Agua",
    categoria: "extras",
    precio: "20 / 35",
    descripcion: "600ml ($20) / LT ($35)"
  },
  {
    nombre: "Refresco",
    categoria: "extras",
    precio: 30,
    descripcion: ""
  },
  {
    nombre: "Oz de Espresso",
    categoria: "extras",
    precio: 25,
    descripcion: "p/oz"
  },
  {
    nombre: "Oz de Leche",
    categoria: "extras",
    precio: 15,
    descripcion: "p/oz"
  },
  {
    nombre: "Oz de Alcohol",
    categoria: "extras",
    precio: 55,
    descripcion: "p/oz"
  },
  {
    nombre: "Cerveza",
    categoria: "extras",
    precio: 45,
    descripcion: "Tecate, Indio, Modelo"
  }
];
const contenedorTarjetas = document.querySelector('#contenedor-tarjetas');
function rellenarCompleto(){
  let resultadosHtml = menuCafeteria.map(item => {
  return `
    <div class="tarjeta max-w-sm rounded overflow-hidden shadow-lg">
      <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-gray-700 text-base">${item.descripcion}</p>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${item.precio}</span>
      </div>
    </div>
  `}).join('');
  contenedorTarjetas.innerHTML=resultadosHtml;
};
function rellenarFiltrado(resultados){
  let resultadosHtml= resultados.map(item => {
  return `<div class="tarjeta max-w-sm rounded overflow-hidden shadow-lg">
      <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">${item.nombre}</div>
        <p class="text-gray-700 text-base">${item.descripcion}</p>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">$${item.precio}</span>
      </div>
    </div>
  `}).join('');
  contenedorTarjetas.innerHTML=resultadosHtml;
};

rellenarCompleto();

const busquedaInput=document.querySelector("#busqueda")
busquedaInput.addEventListener('input', (busca) => {
  const texto = busca.target.value.toLowerCase().trim();
  if(texto===''){
    rellenarCompleto();
    return;
  }
  const resultados = menuCafeteria.filter((item) => {
    const coincideNombre = item.nombre.toLowerCase().includes(texto);
    const coincideDescripcion = item.descripcion.toLowerCase().includes(texto);
    const coincideCategoria = item.categoria.toLowerCase().includes(texto);

    return coincideNombre || coincideDescripcion || coincideCategoria;
  });
  rellenarFiltrado(resultados);
});