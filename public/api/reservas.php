<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();
$data = input();

if ($act === 'list' || $act === 'history') {
    $user = requireUser($pdo);
    $statement = $pdo->prepare('SELECT id, external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto FROM reservas WHERE usuario=? ORDER BY fecha DESC, hora DESC');
    $statement->execute([(string)$user['nombre']]);
    $rows = $statement->fetchAll();
    response(['data' => array_map('mapReservation', $rows)]);
}

if ($act === 'create') {
    $user = requireUser($pdo);

    $usuario = (string)$user['nombre'];
    $placa = strtoupper(trim((string)($data['placa'] ?? '')));
    $parqueo = trim((string)($data['parqueo'] ?? ''));
    $espacio = trim((string)($data['espacio'] ?? ''));
    $fecha = trim((string)($data['fecha'] ?? ''));
    $hora = trim((string)($data['hora'] ?? ''));
    $horaSalida = trim((string)($data['horaSalida'] ?? ($data['hora_salida'] ?? '')));
    $externalId = trim((string)($data['id'] ?? ''));

    if ($usuario === '' || $placa === '' || $parqueo === '' || $espacio === '' || $fecha === '' || $hora === '' || $horaSalida === '') {
        response(['message' => 'Debe completar todos los datos de la reserva.'], 422);
    }

    if ($externalId === '') {
        $externalId = 'res-' . time() . '-' . random_int(100, 999);
    }

    $espacioDisponible = $pdo->prepare(
        'SELECT p.precio
         FROM espacios e
         INNER JOIN parqueos p ON p.id = e.parqueo_id
         WHERE p.nombre=? AND e.codigo=? AND e.estado="Disponible"
         LIMIT 1'
    );
    $espacioDisponible->execute([$parqueo, $espacio]);
    $espacioReal = $espacioDisponible->fetch();
    if (!$espacioReal) {
        response(['message' => 'El espacio seleccionado no existe o no está disponible para este parqueo.'], 422);
    }

    $conflict = $pdo->prepare('SELECT id FROM reservas WHERE parqueo=? AND espacio=? AND fecha=? AND estado IN ("Activa", "Confirmada") LIMIT 1');
    $conflict->execute([$parqueo, $espacio, $fecha]);
    if ($conflict->fetch()) {
        response(['message' => 'Ese espacio ya está reservado para la fecha seleccionada.'], 409);
    }

    $monto = (float)$espacioReal['precio'];
    $insert = $pdo->prepare('INSERT INTO reservas (external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insert->execute([$externalId, $usuario, $placa, $parqueo, $espacio, $fecha, $hora, $horaSalida, 'Activa', $monto]);

    response(['message' => 'Reserva registrada correctamente.', 'id' => $externalId], 201);
}

if ($act === 'cancel') {
    $user = requireUser($pdo);

    $id = trim((string)($data['id'] ?? ''));
    if ($id === '') {
        response(['message' => 'Debe indicar la reserva a cancelar.'], 422);
    }

    $update = $pdo->prepare('UPDATE reservas SET estado="Cancelada" WHERE (external_id=? OR id=?) AND usuario=?');
    $update->execute([$id, (int)$id, (string)$user['nombre']]);

    response(['message' => 'Reserva cancelada.']);
}

response(['message' => 'Acción no encontrada.'], 404);
