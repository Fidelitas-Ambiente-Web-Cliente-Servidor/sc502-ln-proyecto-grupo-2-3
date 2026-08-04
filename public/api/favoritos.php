<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();
$data = input();
$user = requireUser($pdo);

if ($act === 'list') {
    $query = $pdo->prepare('SELECT parqueo_id FROM favoritos WHERE usuario_id=?');
    $query->execute([(int)$user['id']]);
    response(['data' => array_map('intval', array_column($query->fetchAll(), 'parqueo_id'))]);
}

if ($act === 'toggle' || $act === 'set') {
    $parkingId = (int)($data['parkingId'] ?? 0);
    $active = !empty($data['active']);

    if ($parkingId <= 0) {
        response(['message' => 'Parqueo inválido.'], 422);
    }

    if ($active) {
        $insert = $pdo->prepare('INSERT INTO favoritos (usuario_id, parqueo_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE parqueo_id=VALUES(parqueo_id)');
        $insert->execute([(int)$user['id'], $parkingId]);
    } else {
        $delete = $pdo->prepare('DELETE FROM favoritos WHERE usuario_id=? AND parqueo_id=?');
        $delete->execute([(int)$user['id'], $parkingId]);
    }

    response(['message' => 'Favorito actualizado.']);
}

response(['message' => 'Acción no encontrada.'], 404);
