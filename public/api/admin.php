<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();
$data = input();
requireAdmin($pdo);

if ($act === 'users') {
    $rows = $pdo->query('SELECT id, nombre, correo, telefono, rol, estado FROM usuarios ORDER BY id DESC')->fetchAll();
    response(['data' => $rows]);
}

if ($act === 'user-status') {
    $id = (int)($data['id'] ?? 0);
    $estado = trim((string)($data['estado'] ?? ''));
    if ($id <= 0 || !in_array($estado, ['Activo', 'Inactivo'], true)) {
        response(['message' => 'Datos inválidos.'], 422);
    }

    $statement = $pdo->prepare('UPDATE usuarios SET estado=? WHERE id=?');
    $statement->execute([$estado, $id]);
    response(['message' => 'Usuario actualizado.']);
}

if ($act === 'reservas') {
    $rows = $pdo->query('SELECT id, external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto FROM reservas ORDER BY fecha DESC, hora DESC')->fetchAll();
    response(['data' => array_map('mapReservation', $rows)]);
}

if ($act === 'reserva-cancel') {
    $id = trim((string)($data['id'] ?? ''));
    if ($id === '') {
        response(['message' => 'Debe indicar la reserva.'], 422);
    }

    $statement = $pdo->prepare('UPDATE reservas SET estado="Cancelada" WHERE external_id=? OR id=?');
    $statement->execute([$id, (int)$id]);
    response(['message' => 'Reserva cancelada.']);
}

if ($act === 'parkings') {
    $rows = $pdo->query('SELECT id, nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen FROM parqueos ORDER BY id DESC')->fetchAll();
    response(['data' => array_map(static function (array $row): array {
        $mapped = mapParking($row);
        unset($mapped['origen']);
        return $mapped;
    }, $rows)]);
}

if ($act === 'parking-save') {
    $id = (int)($data['id'] ?? 0);
    $nombre = trim((string)($data['nombre'] ?? ''));
    $provincia = trim((string)($data['provincia'] ?? 'San José'));
    $zona = trim((string)($data['zona'] ?? 'Centro'));
    $ubicacion = trim((string)($data['ubicacion'] ?? 'Sin ubicación'));
    $precio = (float)($data['precio'] ?? 0);
    $espacios = (int)($data['espacios'] ?? 0);
    $imagen = trim((string)($data['imagen'] ?? ''));

    if ($nombre === '' || $precio <= 0) {
        response(['message' => 'Complete los datos obligatorios del parqueo.'], 422);
    }

    if ($id > 0) {
        $update = $pdo->prepare('UPDATE parqueos SET nombre=?, provincia=?, zona=?, ubicacion=?, precio=?, espacios=?, disponible=?, imagen=? WHERE id=?');
        $update->execute([$nombre, $provincia, $zona, $ubicacion, $precio, max(0, $espacios), $espacios > 0 ? 1 : 0, $imagen, $id]);
        response(['message' => 'Parqueo actualizado.']);
    }

    $insert = $pdo->prepare('INSERT INTO parqueos (nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen) VALUES (?, ?, ?, ?, ?, ?, 4.5, ?, ?, "aprobado")');
    $insert->execute([$nombre, $provincia, $zona, $ubicacion, $precio, max(0, $espacios), $espacios > 0 ? 1 : 0, $imagen]);
    response(['message' => 'Parqueo creado.', 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($act === 'parking-delete') {
    $id = (int)($data['id'] ?? 0);
    if ($id <= 0) {
        response(['message' => 'Parqueo inválido.'], 422);
    }

    $delete = $pdo->prepare('DELETE FROM parqueos WHERE id=?');
    $delete->execute([$id]);
    response(['message' => 'Parqueo eliminado.']);
}

if ($act === 'requests') {
    $solicitudes = getState($pdo, 'parkeate-solicitudes-parqueo', []);
    response(['data' => is_array($solicitudes) ? $solicitudes : []]);
}

if ($act === 'request-approve' || $act === 'request-reject') {
    $id = trim((string)($data['id'] ?? ''));
    if ($id === '') {
        response(['message' => 'Solicitud inválida.'], 422);
    }

    $solicitudes = getState($pdo, 'parkeate-solicitudes-parqueo', []);
    if (!is_array($solicitudes)) {
        $solicitudes = [];
    }

    $target = null;
    $restantes = [];
    foreach ($solicitudes as $s) {
        if ((string)($s['id'] ?? '') === $id) {
            $target = $s;
            continue;
        }
        $restantes[] = $s;
    }

    if (!$target) {
        response(['message' => 'Solicitud no encontrada.'], 404);
    }

    if ($act === 'request-approve') {
        $insert = $pdo->prepare('INSERT INTO parqueos (nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen) VALUES (?, ?, ?, ?, 1200, 10, 4.5, 1, ?, "aprobado")');
        $insert->execute([
            (string)($target['nombre'] ?? 'Parqueo aprobado'),
            (string)($target['provincia'] ?? 'San José'),
            (string)($target['zona'] ?? 'Centro'),
            (string)(($target['zona'] ?? 'Centro') . ', ' . ($target['provincia'] ?? 'San José')),
            'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800'
        ]);
    }

    setState($pdo, 'parkeate-solicitudes-parqueo', $restantes);
    response(['message' => 'Solicitud procesada.']);
}

if ($act === 'dashboard') {
    $totUsuarios = (int)$pdo->query('SELECT COUNT(*) FROM usuarios')->fetchColumn();
    $totEspacios = (int)$pdo->query('SELECT COALESCE(SUM(espacios),0) FROM parqueos')->fetchColumn();
    $totDisponibles = (int)$pdo->query('SELECT COALESCE(SUM(espacios),0) FROM parqueos WHERE disponible=1')->fetchColumn();
    $totReservas = (int)$pdo->query('SELECT COUNT(*) FROM reservas')->fetchColumn();

    response([
        'data' => [
            'usuarios' => $totUsuarios,
            'espacios' => $totEspacios,
            'disponibles' => $totDisponibles,
            'reservas' => $totReservas,
        ]
    ]);
}

if ($act === 'state-set') {
    $key = trim((string)($data['key'] ?? ''));
    $value = $data['data'] ?? null;
    if ($key === '') {
        response(['message' => 'La clave es obligatoria.'], 422);
    }
    setState($pdo, $key, $value);
    response(['message' => 'Estado actualizado.']);
}

response(['message' => 'Acción no encontrada.'], 404);
