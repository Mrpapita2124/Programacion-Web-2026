<?php
require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

function generarNombreImagen(string $nombre): string
{
    $slug = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', $nombre) ?: $nombre);
    $slug = preg_replace('/\s+/', '_', trim($slug));
    return $slug . '.png';
}

function validarProducto(array $d): array
{
    $nombre = trim($d['nombre'] ?? '');
    $categoria = trim($d['categoria'] ?? '');
    $precio = $d['precio'] ?? null;
    $unidadMedida = trim($d['unidad_medida'] ?? '');
    $disponibles = $d['disponibles'] ?? 0;
    $descripcion = trim($d['descripcion'] ?? '');
    $descripcionLarga = trim($d['descripcion_larga'] ?? '');
    $imagen = trim($d['imagen'] ?? '');

    if (
        mb_strlen($nombre, 'UTF-8') < 3 ||
        mb_strlen($nombre, 'UTF-8') > 100 ||
        $categoria === '' ||
        mb_strlen($categoria, 'UTF-8') > 50 ||
        !is_numeric($precio) ||
        (float) $precio <= 0 ||
        !is_numeric($disponibles) ||
        (int) $disponibles < 0
    ) {
        responder(['error' => 'Datos de producto inválidos'], 422);
    }

    return [
        'nombre' => $nombre,
        'categoria' => $categoria,
        'precio' => (float) $precio,
        'unidad_medida' => $unidadMedida,
        'disponibles' => (int) $disponibles,
        'descripcion' => $descripcion,
        'descripcion_larga' => $descripcionLarga,
        'imagen' => $imagen !== '' ? $imagen : generarNombreImagen($nombre),
    ];
}

try {
    $pdo = conectar();
    $metodo = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
    $campos = 'id, nombre, categoria, precio, unidad_medida, disponibles, descripcion, descripcion_larga';

    switch ($metodo) {
        case 'GET':
            if ($id !== null) {
                $stmt = $pdo->prepare("SELECT {$campos} FROM productos WHERE id = :id AND activo = 1");
                $stmt->execute(['id' => $id]);
                $producto = $stmt->fetch();

                if (!$producto) {
                    responder(['error' => 'Producto no encontrado'], 404);
                }

                responder(formatearProducto($producto));
            }

            $condiciones = ['activo = 1'];
            $params = [];

            $categoria = trim($_GET['categoria'] ?? '');
            if ($categoria !== '' && strtolower($categoria) !== 'todas') {
                $condiciones[] = 'LOWER(categoria) = LOWER(:categoria)';
                $params['categoria'] = $categoria;
            }

            $buscar = trim($_GET['buscar'] ?? '');
            if ($buscar !== '') {
                $condiciones[] = '(nombre LIKE :buscarNombre OR descripcion LIKE :buscarDesc)';
                $params['buscarNombre'] = "%{$buscar}%";
                $params['buscarDesc'] = "%{$buscar}%";
            }

            $where = implode(' AND ', $condiciones);
            $stmt = $pdo->prepare("SELECT {$campos} FROM productos WHERE {$where} ORDER BY id");
            $stmt->execute($params);

            responder(array_map('formatearProducto', $stmt->fetchAll()));
            break;

        case 'POST':
            $datos = validarProducto(leerJson());
            $stmt = $pdo->prepare(
                'INSERT INTO productos (nombre, categoria, precio, unidad_medida, disponibles, descripcion, descripcion_larga, imagen, activo)
                 VALUES (:nombre, :categoria, :precio, :unidad_medida, :disponibles, :descripcion, :descripcion_larga, :imagen, 1)'
            );
            $stmt->execute($datos);

            $nuevoId = (int) $pdo->lastInsertId();
            unset($datos['imagen']);
            responder(formatearProducto(['id' => $nuevoId] + $datos), 201);
            break;

        case 'PUT':
            if ($id === null || $id <= 0) {
                responder(['error' => 'Falta el id'], 400);
            }

            $datos = validarProducto(leerJson());

            $existe = $pdo->prepare('SELECT id FROM productos WHERE id = :id AND activo = 1');
            $existe->execute(['id' => $id]);
            if (!$existe->fetch()) {
                responder(['error' => 'Producto no encontrado'], 404);
            }

            $stmt = $pdo->prepare(
                'UPDATE productos
                 SET nombre = :nombre, categoria = :categoria, precio = :precio,
                     unidad_medida = :unidad_medida, disponibles = :disponibles,
                     descripcion = :descripcion, descripcion_larga = :descripcion_larga,
                     imagen = :imagen
                 WHERE id = :id'
            );
            $stmt->execute($datos + ['id' => $id]);

            unset($datos['imagen']);
            responder(formatearProducto(['id' => $id] + $datos));
            break;

        case 'DELETE':
            if ($id === null || $id <= 0) {
                responder(['error' => 'Falta el id'], 400);
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM productos WHERE id = :id');
                $stmt->execute(['id' => $id]);
            } catch (PDOException $e) {
                if ($e->getCode() === '23000') {
                    responder(['error' => 'El producto ya está en pedidos y no se puede eliminar'], 409);
                }
                throw $e;
            }

            if ($stmt->rowCount() === 0) {
                responder(['error' => 'Producto no encontrado'], 404);
            }

            http_response_code(204);
            exit;

        default:
            responder(['error' => 'Método no permitido'], 405);
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['error' => 'Ocurrió un error en la base de datos'], 500);
}
