<?php
function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function leerJson(): array
{
    $datos = json_decode(file_get_contents('php://input'), true);
    return is_array($datos) ? $datos : [];
}

function formatearProducto(array $p): array
{
    $p['id'] = (int) $p['id'];
    $p['precio'] = (float) $p['precio'];
    $p['disponibles'] = (int) $p['disponibles'];
    return $p;
}
