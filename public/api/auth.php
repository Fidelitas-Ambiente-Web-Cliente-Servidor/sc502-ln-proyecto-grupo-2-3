<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = database();
$act = action();
$data = input();

if ($act === 'session') {
    response(['user' => currentUser($pdo)]);
}

if ($act === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    response(['message' => 'Sesión cerrada.']);
}

if ($act === 'login') {
    $correo = strtolower(trim((string)($data['correo'] ?? '')));
    $password = (string)($data['password'] ?? '');

    if ($correo === '' || $password === '') {
        response(['message' => 'Correo y contraseña son obligatorios.'], 422);
    }

    $statement = $pdo->prepare('SELECT * FROM usuarios WHERE LOWER(correo)=? LIMIT 1');
    $statement->execute([$correo]);
    $row = $statement->fetch();

    if (!$row || ($row['estado'] ?? '') !== 'Activo') {
        response(['message' => 'Credenciales inválidas.'], 401);
    }

    $hash = (string)($row['password_hash'] ?? '');
    $valid = password_verify($password, $hash) || hash_equals($hash, $password);
    if (!$valid) {
        response(['message' => 'Credenciales inválidas.'], 401);
    }

    if (!password_get_info($hash)['algo'] && $hash === $password) {
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $update = $pdo->prepare('UPDATE usuarios SET password_hash=? WHERE id=?');
        $update->execute([$newHash, (int)$row['id']]);
    }

    $_SESSION['user_id'] = (int)$row['id'];
    response(['user' => userById($pdo, (int)$row['id'])]);
}

if ($act === 'register') {
    $nombre = trim((string)($data['nombre'] ?? ''));
    $correo = strtolower(trim((string)($data['correo'] ?? '')));
    $telefono = trim((string)($data['telefono'] ?? ''));
    $password = (string)($data['password'] ?? '');

    if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        response(['message' => 'Datos de registro inválidos.'], 422);
    }

    $exists = $pdo->prepare('SELECT id FROM usuarios WHERE LOWER(correo)=? LIMIT 1');
    $exists->execute([$correo]);
    if ($exists->fetch()) {
        response(['message' => 'El correo ya está registrado.'], 409);
    }

    $insert = $pdo->prepare('INSERT INTO usuarios (nombre, correo, telefono, password_hash, rol, estado) VALUES (?, ?, ?, ?, ?, ?)');
    $insert->execute([$nombre, $correo, $telefono, password_hash($password, PASSWORD_DEFAULT), 'Usuario', 'Activo']);
    response(['message' => 'Usuario registrado correctamente.'], 201);
}

if ($act === 'update-profile') {
    $user = requireUser($pdo);
    $nombre = trim((string)($data['nombre'] ?? ''));
    $correo = strtolower(trim((string)($data['correo'] ?? '')));
    $telefono = trim((string)($data['telefono'] ?? ''));
    $password = (string)($data['password'] ?? '');

    if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        response(['message' => 'Nombre y correo son obligatorios.'], 422);
    }

    $conflict = $pdo->prepare('SELECT id FROM usuarios WHERE LOWER(correo)=? AND id<>? LIMIT 1');
    $conflict->execute([$correo, (int)$user['id']]);
    if ($conflict->fetch()) {
        response(['message' => 'Ese correo ya pertenece a otro usuario.'], 409);
    }

    if ($password !== '') {
        if (strlen($password) < 8) {
            response(['message' => 'La contraseña debe tener al menos 8 caracteres.'], 422);
        }
        $update = $pdo->prepare('UPDATE usuarios SET nombre=?, correo=?, telefono=?, password_hash=? WHERE id=?');
        $update->execute([$nombre, $correo, $telefono, password_hash($password, PASSWORD_DEFAULT), (int)$user['id']]);
    } else {
        $update = $pdo->prepare('UPDATE usuarios SET nombre=?, correo=?, telefono=? WHERE id=?');
        $update->execute([$nombre, $correo, $telefono, (int)$user['id']]);
    }

    response(['user' => userById($pdo, (int)$user['id'])]);
}

if ($act === 'bootstrap') {
    $usuario = currentUser($pdo);

    $favoritos = [];
    if ($usuario) {
        $favQ = $pdo->prepare('SELECT parqueo_id FROM favoritos WHERE usuario_id=?');
        $favQ->execute([(int)$usuario['id']]);
        $favoritos = array_map('intval', array_column($favQ->fetchAll(), 'parqueo_id'));
    }

    response([
        'user' => $usuario,
        'keys' => [
            'parkeate-solicitudes-parqueo' => getState($pdo, 'parkeate-solicitudes-parqueo', []),
            'parkeate-resenas' => getState($pdo, 'parkeate-resenas', []),
            'parkeate-incidentes' => getState($pdo, 'parkeate-incidentes', []),
            'parkeate-config-alertas' => getState($pdo, 'parkeate-config-alertas', ['zona' => '', 'parqueo' => '']),
            'espacios-admin-parkeate' => getState($pdo, 'espacios-admin-parkeate', []),
            'alertas-leidas-parkeate' => getState($pdo, 'alertas-leidas-parkeate', []),
        ],
        'favoritos' => $favoritos,
    ]);
}

response(['message' => 'Acción no encontrada.'], 404);
