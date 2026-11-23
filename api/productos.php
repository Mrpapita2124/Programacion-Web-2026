<?php
require __DIR__ . '/helpers.php';
$productos = require __DIR__ . '/data/catalogo-productos.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(['error' => 'Método no permitido'], 405);
}

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    foreach ($productos as $p) {
        if ($p['id'] === $id) {
            responder($p);
        }
    }
    responder(['error' => 'Producto no encontrado'], 404);
}

$categoria = trim($_GET['categoria'] ?? '');
if ($categoria !== '' && strtolower($categoria) !== 'todas') {
    $productos = array_values(array_filter(
        $productos,
        fn($p) => mb_strtolower($p['categoria'], 'UTF-8') === mb_strtolower($categoria, 'UTF-8')
    ));
}

$buscar = trim($_GET['buscar'] ?? '');
if ($buscar !== '') {
    $productos = array_values(array_filter(
        $productos,
        fn($p) => stripos($p['nombre'], $buscar) !== false || stripos($p['descripcion'], $buscar) !== false
    ));
}

responder($productos);
