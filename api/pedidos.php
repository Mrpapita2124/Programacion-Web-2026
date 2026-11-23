<?php
require __DIR__ . '/helpers.php';

$archivo = __DIR__ . '/data/pedidos.json';
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $pedidos = file_exists($archivo) ? json_decode(file_get_contents($archivo), true) : [];
    if (!is_array($pedidos)) {
        $pedidos = [];
    }

    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        foreach ($pedidos as $pedido) {
            if ((int) ($pedido['id'] ?? 0) === $id) {
                responder($pedido);
            }
        }
        responder(['error' => 'Pedido no encontrado'], 404);
    }

    responder($pedidos);
}

if ($metodo !== 'POST') {
    responder(['error' => 'Método no permitido'], 405);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(['error' => 'JSON inválido'], 422);
}

$nombre = trim($entrada['nombre'] ?? '');
$notas = trim($entrada['notas'] ?? '');
$items = $entrada['items'] ?? [];

if (mb_strlen($nombre, 'UTF-8') < 3) {
    responder(['error' => 'El nombre para el pedido debe tener al menos 3 caracteres'], 422);
}

if (!is_array($items) || count($items) === 0) {
    responder(['error' => 'El carrito no puede estar vacío'], 422);
}

$productos = require __DIR__ . '/data/catalogo-productos.php';
$mapaProductos = [];
foreach ($productos as $p) {
    $mapaProductos[$p['id']] = $p;
}

$total = 0;
$itemsValidados = [];

foreach ($items as $item) {
    $id = (int) ($item['id'] ?? 0);
    $cantidad = (int) ($item['cantidad'] ?? 0);

    if ($id <= 0 || !isset($mapaProductos[$id])) {
        responder(['error' => 'Uno de los productos del carrito no existe'], 422);
    }

    if ($cantidad <= 0) {
        responder(['error' => 'La cantidad de cada producto debe ser un número positivo'], 422);
    }

    $producto = $mapaProductos[$id];
    if ($producto['disponibles'] < $cantidad) {
        responder(['error' => "No hay suficientes existencias de {$producto['nombre']}"], 422);
    }

    $precio = (float) $producto['precio'];
    $total += $precio * $cantidad;

    $itemsValidados[] = [
        'id' => $id,
        'nombre' => $producto['nombre'],
        'precio' => $precio,
        'cantidad' => $cantidad,
        'subtotal' => $precio * $cantidad,
    ];
}

$pedidos = file_exists($archivo) ? json_decode(file_get_contents($archivo), true) : [];
if (!is_array($pedidos)) {
    $pedidos = [];
}

$ultimoId = 0;
foreach ($pedidos as $p) {
    if ((int) ($p['id'] ?? 0) > $ultimoId) {
        $ultimoId = (int) $p['id'];
    }
}

$pedido = [
    'id' => $ultimoId + 1,
    'nombre' => $nombre,
    'notas' => $notas,
    'items' => $itemsValidados,
    'total' => $total,
    'creado' => date('c'),
];

$pedidos[] = $pedido;
file_put_contents(
    $archivo,
    json_encode($pedidos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
    LOCK_EX
);

responder($pedido, 201);
