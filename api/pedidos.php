<?php
require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    try {
        $pdo = conectar();

        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT id, nombre, notas, total, creado_en FROM pedidos WHERE id = :id');
            $stmt->execute(['id' => (int) $_GET['id']]);
            $pedido = $stmt->fetch();

            if (!$pedido) {
                responder(['error' => 'Pedido no encontrado'], 404);
            }

            $stmtItems = $pdo->prepare(
                'SELECT pi.producto_id AS id, p.nombre, pi.precio_unitario AS precio, pi.cantidad,
                        (pi.precio_unitario * pi.cantidad) AS subtotal
                 FROM pedido_items pi
                 JOIN productos p ON p.id = pi.producto_id
                 WHERE pi.pedido_id = :pedido_id'
            );
            $stmtItems->execute(['pedido_id' => (int) $pedido['id']]);

            $pedido['id'] = (int) $pedido['id'];
            $pedido['total'] = (float) $pedido['total'];
            $pedido['items'] = $stmtItems->fetchAll();

            responder($pedido);
        }

        $pedidos = $pdo->query('SELECT id, nombre, notas, total, creado_en FROM pedidos ORDER BY id DESC')->fetchAll();
        foreach ($pedidos as &$p) {
            $p['id'] = (int) $p['id'];
            $p['total'] = (float) $p['total'];
        }
        unset($p);

        responder($pedidos);
    } catch (PDOException $e) {
        error_log($e->getMessage());
        responder(['error' => 'Error al consultar los pedidos'], 500);
    }
}

if ($metodo !== 'POST') {
    responder(['error' => 'Método no permitido'], 405);
}

$entrada = leerJson();
$nombre = trim($entrada['nombre'] ?? '');
$notas = trim($entrada['notas'] ?? '');
$items = $entrada['items'] ?? [];

if (mb_strlen($nombre, 'UTF-8') < 3) {
    responder(['error' => 'El nombre para el pedido debe tener al menos 3 caracteres'], 422);
}

if (!is_array($items) || count($items) === 0) {
    responder(['error' => 'El carrito no puede estar vacío'], 422);
}

try {
    $pdo = conectar();
    $buscarProducto = $pdo->prepare(
        'SELECT id, nombre, precio, disponibles FROM productos WHERE id = :id AND activo = 1'
    );

    $total = 0;
    $lineas = [];

    foreach ($items as $item) {
        $productoId = (int) ($item['id'] ?? 0);
        $cantidad = (int) ($item['cantidad'] ?? 0);

        $buscarProducto->execute(['id' => $productoId]);
        $producto = $buscarProducto->fetch();

        if (!$producto) {
            responder(['error' => 'Uno de los productos del carrito no existe'], 422);
        }

        if ($cantidad <= 0) {
            responder(['error' => 'La cantidad de cada producto debe ser un número positivo'], 422);
        }

        if ((int) $producto['disponibles'] < $cantidad) {
            responder(['error' => "No hay suficientes existencias de {$producto['nombre']}"], 422);
        }

        $precio = (float) $producto['precio'];
        $subtotal = $precio * $cantidad;
        $total += $subtotal;

        $lineas[] = [
            'id' => (int) $producto['id'],
            'nombre' => $producto['nombre'],
            'precio' => $precio,
            'cantidad' => $cantidad,
            'subtotal' => $subtotal,
        ];
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO pedidos (nombre, notas, total) VALUES (:nombre, :notas, :total)');
        $stmt->execute([
            'nombre' => $nombre,
            'notas' => $notas,
            'total' => $total,
        ]);
        $pedidoId = (int) $pdo->lastInsertId();

        $stmtItem = $pdo->prepare(
            'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
             VALUES (:pedido, :producto, :cantidad, :precio)'
        );
        $stmtStock = $pdo->prepare(
            'UPDATE productos SET disponibles = disponibles - :cantidad WHERE id = :id AND disponibles >= :min_cantidad'
        );

        foreach ($lineas as $linea) {
            $stmtItem->execute([
                'pedido' => $pedidoId,
                'producto' => $linea['id'],
                'cantidad' => $linea['cantidad'],
                'precio' => $linea['precio'],
            ]);

            $stmtStock->execute([
                'cantidad' => $linea['cantidad'],
                'id' => $linea['id'],
                'min_cantidad' => $linea['cantidad'],
            ]);
        }

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    responder([
        'id' => $pedidoId,
        'nombre' => $nombre,
        'notas' => $notas,
        'items' => $lineas,
        'total' => $total,
        'creado' => date('c'),
    ], 201);
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['error' => 'No se pudo guardar el pedido'], 500);
}
