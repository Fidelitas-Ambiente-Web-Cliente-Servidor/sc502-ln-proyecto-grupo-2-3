<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();

if ($act === 'list' || $act === '') {
    $sql = 'SELECT id, nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen FROM parqueos';
    $params = [];
    $filtros = [];

    if (!empty($_GET['provincia'])) {
        $filtros[] = 'provincia = ?';
        $params[] = trim((string)$_GET['provincia']);
    }
    if (!empty($_GET['zona'])) {
        $filtros[] = 'LOWER(zona) LIKE ?';
        $params[] = '%' . strtolower(trim((string)$_GET['zona'])) . '%';
    }
    if (!empty($_GET['nombre'])) {
        $filtros[] = 'LOWER(nombre) LIKE ?';
        $params[] = '%' . strtolower(trim((string)$_GET['nombre'])) . '%';
    }

    if ($filtros) {
        $sql .= ' WHERE ' . implode(' AND ', $filtros);
    }
    $sql .= ' ORDER BY nombre';

    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $rows = $statement->fetchAll();
    response(['data' => array_map(static function (array $row): array {
        $mapped = mapParking($row);
        unset($mapped['origen']);
        return $mapped;
    }, $rows)]);
}

response(['message' => 'Acción no encontrada.'], 404);
