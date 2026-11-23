export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.error(`No fue posible guardar "${clave}"`, error);
    return false;
  }
}

export function leer(clave, defecto = null) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? defecto;
  } catch (error) {
    console.warn(`No fue posible leer "${clave}"; se usará el valor por defecto.`, error);
    return defecto;
  }
}

export function eliminar(clave) {
  try {
    localStorage.removeItem(clave);
  } catch (error) {
    console.error(`No fue posible eliminar "${clave}"`, error);
  }
}
