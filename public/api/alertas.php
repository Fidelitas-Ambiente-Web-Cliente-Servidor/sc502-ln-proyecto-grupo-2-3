<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();
$data = input();

if ($act === 'config') {
    $config = getState($pdo, 'parkeate-config-alertas', ['zona' => '', 'parqueo' => '']);
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nuevo = [
            'zona' => trim((string)($data['zona'] ?? '')),
            'parqueo' => trim((string)($data['parqueo'] ?? '')),
        ];
        setState($pdo, 'parkeate-config-alertas', $nuevo);
        response(['message' => 'Configuración guardada.', 'config' => $nuevo]);
    }
    response(['config' => $config]);
}

if ($act === 'list' || $act === 'all') {
    $config = getState($pdo, 'parkeate-config-alertas', ['zona' => '', 'parqueo' => '']);
    $leidas = getState($pdo, 'alertas-leidas-parkeate', []);
    $usuario = currentUser($pdo);

    $reservas = $pdo->query('SELECT id, external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto FROM reservas ORDER BY fecha DESC, hora DESC LIMIT 5')->fetchAll();

    $where = [];
    $params = [];
    if (!empty($config['parqueo'])) {
        $where[] = 'nombre = ?';
        $params[] = (string)$config['parqueo'];
    }
    if (!empty($config['zona'])) {
        $where[] = 'LOWER(zona) LIKE ?';
        $params[] = '%' . strtolower((string)$config['zona']) . '%';
    }

    $sql = 'SELECT id, nombre, espacios, disponible FROM parqueos';
    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY id DESC LIMIT 3';
    $parkStmt = $pdo->prepare($sql);
    $parkStmt->execute($params);
    $parkings = $parkStmt->fetchAll();

    $alertas = [];

    if ($usuario) {
        $stored = $pdo->prepare('SELECT a.id, a.titulo, a.mensaje, a.leida, t.nombre tipo FROM alertas a JOIN catalogo_tipo_alerta t ON t.id = a.tipo_alerta_id WHERE a.usuario_id = ? OR a.usuario_id IS NULL ORDER BY a.created_at DESC LIMIT 8');
        $stored->execute([(int)$usuario['id']]);
        foreach ($stored->fetchAll() as $row) {
            $tipo = strtolower((string)$row['tipo']);
            $icono = 'bi-bell-fill text-warning';
            if ($tipo === 'reserva') $icono = 'bi-check-circle-fill text-success';
            if ($tipo === 'disponibilidad') $icono = 'bi-car-front-fill text-primary';
            if ($tipo === 'favorito') $icono = 'bi-heart-fill text-danger';
            if ($tipo === 'promoción') $icono = 'bi-percent text-danger';

            $alertas[] = [
                'id' => 'stored-' . $row['id'],
                'icono' => $icono,
                'titulo' => (string)$row['titulo'],
                'tiempo' => 'Reciente',
                'mensaje' => (string)$row['mensaje'],
                'leida' => (bool)$row['leida'],
            ];
        }
    }
    foreach ($reservas as $index => $r) {
        $id = 'reserva-' . ($r['external_id'] ?: $r['id']) . '-' . $index;
        $alertas[] = [
            'id' => $id,
            'icono' => 'bi-check-circle-fill text-success',
            'titulo' => 'Reserva Confirmada',
            'tiempo' => 'Reciente',
            'mensaje' => 'Tu reserva en ' . $r['parqueo'] . ' para ' . $r['fecha'] . ' a las ' . substr((string)$r['hora'], 0, 5) . ' fue registrada.',
            'leida' => in_array($id, $leidas, true),
        ];
    }

    foreach ($parkings as $p) {
        $id = 'parqueo-' . $p['id'];
        $alertas[] = [
            'id' => $id,
            'icono' => 'bi-car-front-fill text-primary',
            'titulo' => 'Espacios Disponibles',
            'tiempo' => 'Actualizado',
            'mensaje' => $p['nombre'] . ' tiene ' . (int)$p['espacios'] . ' espacios disponibles.',
            'leida' => in_array($id, $leidas, true),
        ];
    }

    response(['data' => $alertas]);
}

if ($act === 'mark-read') {
    $ids = $data['ids'] ?? [];
    if (!is_array($ids)) {
        $ids = [];
    }
    setState($pdo, 'alertas-leidas-parkeate', array_values(array_unique(array_map('strval', $ids))));
    response(['message' => 'Alertas actualizadas.']);
}

response(['message' => 'Acción no encontrada.'], 404);
