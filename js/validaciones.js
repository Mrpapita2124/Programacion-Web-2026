export function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

export function validarTelefono(telefono) {
    const regex = /^\d{10}$/;
    return regex.test(telefono);
}

export function validarNombre(nombre) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
}

export function validarContraseña(contraseña) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(contraseña);
}

export function validarNumeroTelefono(numero) {
    const regex = /^\d{10}$/;
    return regex.test(numero);
}