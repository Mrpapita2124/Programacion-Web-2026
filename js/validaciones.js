function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}
function validarTelefono(telefono) {
    const regex = /^\d{10}$/;
    return regex.test(telefono);
}
function validarNombre(nombre) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
}