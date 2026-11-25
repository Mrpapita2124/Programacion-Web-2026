export function mostrarError(campo, mensaje) {
    const spanError = document.querySelector('.error-campo[data-error-para="' + campo + '"]');
    if (spanError) {
        spanError.textContent = mensaje;
    }
}

export function validarNombre(nombre, campo = 'nombre') {
    if (!nombre) {
        mostrarError(campo, campo === 'nombre' ? 'El nombre es obligatorio.' : 'Los apellidos son obligatorios.');
        return false;
    }
    const letrasValidas = "abcdefghijklmnñopqrstuvwxyzáéíóúü ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ";
    for (let i = 0; i < nombre.length; i++) {
        if (!letrasValidas.includes(nombre[i])) {
            mostrarError(campo, 'Solo debe contener letras y espacios.');
            return false;
        }
    }
    mostrarError(campo, '');
    return true;
}

export function validarCorreo(correo, campo = 'email') {
    if (!correo) {
        mostrarError(campo, 'El correo electrónico es obligatorio.');
        return false;
    }
    if (correo.includes(" ")) {
        mostrarError(campo, 'El correo no debe contener espacios en blanco.');
        return false;
    }
    const posArroba = correo.indexOf("@");
    const ultimoArroba = correo.lastIndexOf("@");
    if (posArroba === -1 || posArroba !== ultimoArroba) {
        mostrarError(campo, "El correo debe contener un único símbolo '@'.");
        return false;
    }
    if (posArroba === 0) {
        mostrarError(campo, "El correo debe tener un usuario antes del '@'.");
        return false;
    }
    const parteDominio = correo.slice(posArroba + 1);
    const posPunto = parteDominio.lastIndexOf(".");
    if (posPunto === -1) {
        mostrarError(campo, 'El dominio del correo debe contener un punto (ej. .com).');
        return false;
    }
    if (posPunto === 0) {
        mostrarError(campo, 'Debe haber un nombre de servidor entre el @ y el punto.');
        return false;
    }
    const extension = parteDominio.slice(posPunto + 1);
    if (extension.length < 2) {
        mostrarError(campo, 'La extensión del correo debe tener al menos 2 letras (ej. .com).');
        return false;
    }
    mostrarError(campo, '');
    return true;
}

export function validarTelefono(telefono, campo = 'telefono') {
    if (!telefono) {
        mostrarError(campo, 'El teléfono es obligatorio.');
        return false;
    }
    if (telefono.length !== 10) {
        mostrarError(campo, 'El teléfono debe contener exactamente 10 dígitos numéricos.');
        return false;
    }
    const numeros = "0123456789";
    for (let i = 0; i < telefono.length; i++) {
        if (!numeros.includes(telefono[i])) {
            mostrarError(campo, 'El teléfono solo puede contener números.');
            return false;
        }
    }
    mostrarError(campo, '');
    return true;
}

export function validarContraseña(contraseña, campo = 'password') {
    if (!contraseña) {
        mostrarError(campo, 'La contraseña es obligatoria.');
        return false;
    }
    if (contraseña.length < 8) {
        mostrarError(campo, 'Mínimo 8 caracteres.');
        return false;
    }
    if (contraseña.includes(" ")) {
        mostrarError(campo, 'La contraseña no debe contener espacios.');
        return false;
    }
    const letras = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    const numeros = "0123456789";
    let tieneLetra = false;
    let tieneNumero = false;

    for (let i = 0; i < contraseña.length; i++) {
        const char = contraseña[i];
        if (letras.includes(char)) {
            tieneLetra = true;
        } else if (numeros.includes(char)) {
            tieneNumero = true;
        } else {
            mostrarError(campo, 'No debe contener caracteres especiales.');
            return false;
        }
    }

    if (!tieneLetra) {
        mostrarError(campo, 'Debe incluir al menos una letra.');
        return false;
    }
    if (!tieneNumero) {
        mostrarError(campo, 'Debe incluir al menos un número.');
        return false;
    }
    mostrarError(campo, '');
    return true;
}

export function validarEstado(estado, campo = 'estado') {
    if (!estado || estado === 'Default') {
        mostrarError(campo, 'Debes seleccionar un estado de la lista.');
        return false;
    }
    mostrarError(campo, '');
    return true;
}

export function validarTerminos(terminos, campo = 'terminos') {
    if (!terminos) {
        mostrarError(campo, 'Debes aceptar los términos y condiciones.');
        return false;
    }
    mostrarError(campo, '');
    return true;
}
