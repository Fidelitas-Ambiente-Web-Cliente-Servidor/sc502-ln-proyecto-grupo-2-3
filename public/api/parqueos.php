<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();

if ($act === 'spaces') {
    requireUser($pdo);
    $parkingId = (int)($_GET['parkingId'] ?? 0);
    $fecha = trim((string)($_GET['fecha'] ?? ''));
    $date = DateTime::createFromFormat('Y-m-d', $fecha);

    if ($parkingId <= 0 || !$date || $date->format('Y-m-d') !== $fecha) {
        response(['message' => 'Parqueo y fecha válidos son obligatorios.'], 422);
    }

    $statement = $pdo->prepare(
        'SELECT e.id, e.codigo, e.zona, e.tarifa
         FROM espacios e
         INNER JOIN parqueos p ON p.id = e.parqueo_id
         WHERE e.parqueo_id = ? AND e.estado = "Disponible"
           AND NOT EXISTS (
               SELECT 1 FROM reservas r
               WHERE r.parqueo = p.nombre AND r.espacio = e.codigo AND r.fecha = ?
                 AND r.estado IN ("Activa", "Confirmada")
           )
         ORDER BY e.zona, e.codigo'
    );
    $statement->execute([$parkingId, $fecha]);
    response(['data' => $statement->fetchAll()]);
}

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
