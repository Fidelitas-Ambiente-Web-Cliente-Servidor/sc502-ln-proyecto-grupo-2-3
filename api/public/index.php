<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_name('parkeate_session');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function response(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function input(): array {
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }

    if (!empty($_POST)) {
        $cached = $_POST;
        return $cached;
    }

    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') {
        $cached = [];
        return $cached;
    }

    $json = json_decode($raw, true);
    $cached = is_array($json) ? $json : [];
    return $cached;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $name = getenv('DB_DATABASE') ?: 'parkeate';
    $user = getenv('DB_USERNAME') ?: 'root';
    $pass = getenv('DB_PASSWORD') ?: '';

    try {
        $pdo = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            (string)$user,
            (string)$pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return $pdo;
    } catch (Throwable $e) {
        response(['message' => 'No fue posible conectar con la base de datos.', 'error' => $e->getMessage()], 500);
    }
}

function userById(PDO $pdo, int $id): ?array {
    $statement = $pdo->prepare('SELECT id, nombre, correo, telefono, rol, estado FROM usuarios WHERE id = ?');
    $statement->execute([$id]);
    $row = $statement->fetch();
    return $row ?: null;
}

function currentUser(PDO $pdo): ?array {
    $id = (int)($_SESSION['user_id'] ?? 0);
    if ($id <= 0) {
        return null;
    }
    return userById($pdo, $id);
}

function getState(PDO $pdo, string $key, mixed $fallback): mixed {
    $statement = $pdo->prepare('SELECT state_value FROM app_state WHERE state_key = ? LIMIT 1');
    $statement->execute([$key]);
    $value = $statement->fetchColumn();
    if (!is_string($value) || trim($value) === '') {
        return $fallback;
    }
    $decoded = json_decode($value, true);
    return $decoded === null ? $fallback : $decoded;
}

function setState(PDO $pdo, string $key, mixed $value): void {
    $json = json_encode($value, JSON_UNESCAPED_UNICODE);
    if (!is_string($json)) {
        $json = 'null';
    }

    $statement = $pdo->prepare(
        'INSERT INTO app_state (state_key, state_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE state_value = VALUES(state_value), updated_at = CURRENT_TIMESTAMP'
    );
    $statement->execute([$key, $json]);
}

function bootstrapPayload(PDO $pdo): array {
    $users = $pdo->query('SELECT id, nombre, correo, telefono, rol, estado FROM usuarios ORDER BY id')->fetchAll();
    $parkings = $pdo->query('SELECT id, nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen FROM parqueos ORDER BY id')->fetchAll();

    $approved = array_values(array_filter($parkings, static fn(array $p): bool => ($p['origen'] ?? '') === 'aprobado'));
    $allParkings = array_map(static function (array $p): array {
        return [
            'id' => (int)$p['id'],
            'nombre' => $p['nombre'],
            'provincia' => $p['provincia'],
            'zona' => $p['zona'],
            'ubicacion' => $p['ubicacion'],
            'precio' => (float)$p['precio'],
            'espacios' => (int)$p['espacios'],
            'calificacion' => (float)$p['calificacion'],
            'disponible' => (bool)$p['disponible'],
            'imagen' => $p['imagen'],
        ];
    }, $parkings);

    $reservations = $pdo->query('SELECT id, external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto FROM reservas ORDER BY id')->fetchAll();
    $reservations = array_map(static function (array $r): array {
        return [
            'id' => $r['external_id'] ?: 'res-' . $r['id'],
            'usuario' => $r['usuario'],
            'placa' => $r['placa'],
            'parqueo' => $r['parqueo'],
            'espacio' => $r['espacio'],
            'fecha' => $r['fecha'],
            'hora' => $r['hora'],
            'horaSalida' => $r['hora_salida'],
            'estado' => $r['estado'],
            'monto' => (float)$r['monto'],
        ];
    }, $reservations);

    $favorites = [];
    $user = currentUser($pdo);
    if ($user) {
        $statement = $pdo->prepare('SELECT parqueo_id FROM favoritos WHERE usuario_id = ?');
        $statement->execute([(int)$user['id']]);
        $favorites = array_map('intval', array_column($statement->fetchAll(), 'parqueo_id'));
    }

    return [
        'user' => $user,
        'keys' => [
            'parkeate-usuarios' => $users,
            'parkeate-parqueos' => $allParkings,
            'parkeate-parqueos-aprobados' => array_values(array_map(static function (array $p): array {
                unset($p['origen']);
                return $p;
            }, $approved)),
            'reservas-parkeate' => $reservations,
            'parkeate-solicitudes-parqueo' => getState($pdo, 'parkeate-solicitudes-parqueo', []),
            'parkeate-resenas' => getState($pdo, 'parkeate-resenas', []),
            'parkeate-incidentes' => getState($pdo, 'parkeate-incidentes', []),
            'parkeate-config-alertas' => getState($pdo, 'parkeate-config-alertas', ['zona' => '', 'parqueo' => '']),
            'espacios-admin-parkeate' => getState($pdo, 'espacios-admin-parkeate', []),
            'alertas-leidas-parkeate' => getState($pdo, 'alertas-leidas-parkeate', []),
        ],
        'favoritos' => $favorites,
    ];
}

function syncReservations(PDO $pdo, array $rows): void {
    $pdo->exec('DELETE FROM reservas');
    $statement = $pdo->prepare('INSERT INTO reservas (external_id, usuario, placa, parqueo, espacio, fecha, hora, hora_salida, estado, monto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($rows as $row) {
        $statement->execute([
            (string)($row['id'] ?? ''),
            (string)($row['usuario'] ?? ''),
            (string)($row['placa'] ?? ''),
            (string)($row['parqueo'] ?? ''),
            (string)($row['espacio'] ?? ''),
            (string)($row['fecha'] ?? date('Y-m-d')),
            (string)($row['hora'] ?? '08:00'),
            (string)($row['horaSalida'] ?? ($row['hora_salida'] ?? '10:00')),
            (string)($row['estado'] ?? 'Activa'),
            (float)($row['monto'] ?? 0),
        ]);
    }
}

function syncApprovedParkings(PDO $pdo, array $rows): void {
    $delete = $pdo->prepare("DELETE FROM parqueos WHERE origen = 'aprobado'");
    $delete->execute();

    $insert = $pdo->prepare('INSERT INTO parqueos (nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen, origen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($rows as $row) {
        $insert->execute([
            (string)($row['nombre'] ?? 'Parqueo sin nombre'),
            (string)($row['provincia'] ?? 'San José'),
            (string)($row['zona'] ?? 'Centro'),
            (string)($row['ubicacion'] ?? 'Sin ubicación'),
            (float)($row['precio'] ?? 0),
            (int)($row['espacios'] ?? 0),
            (float)($row['calificacion'] ?? 4.5),
            !empty($row['disponible']) ? 1 : 0,
            (string)($row['imagen'] ?? ''),
            'aprobado',
        ]);
    }
}

$pdo = db();
$action = strtolower(trim((string)($_GET['action'] ?? 'health')));
$payload = input();

if ($action === 'health') {
    response(['ok' => true, 'message' => 'API Parkeate operativa.']);
}

if ($action === 'bootstrap') {
    response(bootstrapPayload($pdo));
}

if ($action === 'auth.session') {
    response(['user' => currentUser($pdo)]);
}

if ($action === 'auth.logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    response(['message' => 'Sesión cerrada.']);
}

if ($action === 'auth.login') {
    $correo = strtolower(trim((string)($payload['correo'] ?? '')));
    $password = (string)($payload['password'] ?? '');
    if ($correo === '' || $password === '') {
        response(['message' => 'Correo y contraseña son obligatorios.'], 422);
    }

    $statement = $pdo->prepare('SELECT * FROM usuarios WHERE LOWER(correo) = ? LIMIT 1');
    $statement->execute([$correo]);
    $user = $statement->fetch();
    if (!$user || ($user['estado'] ?? '') !== 'Activo') {
        response(['message' => 'Credenciales inválidas.'], 401);
    }

    $hash = (string)($user['password_hash'] ?? '');
    $valid = password_verify($password, $hash) || hash_equals($hash, $password);
    if (!$valid) {
        response(['message' => 'Credenciales inválidas.'], 401);
    }

    if (!password_get_info($hash)['algo'] && $hash === $password) {
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $update = $pdo->prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?');
        $update->execute([$newHash, (int)$user['id']]);
    }

    $_SESSION['user_id'] = (int)$user['id'];
    response(['user' => userById($pdo, (int)$user['id'])]);
}

if ($action === 'auth.register') {
    $nombre = trim((string)($payload['nombre'] ?? ''));
    $correo = strtolower(trim((string)($payload['correo'] ?? '')));
    $telefono = trim((string)($payload['telefono'] ?? ''));
    $password = (string)($payload['password'] ?? '');

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

if ($action === 'auth.update-profile') {
    $user = currentUser($pdo);
    if (!$user) {
        response(['message' => 'Debe iniciar sesión.'], 401);
    }

    $nombre = trim((string)($payload['nombre'] ?? ''));
    $correo = strtolower(trim((string)($payload['correo'] ?? '')));
    $telefono = trim((string)($payload['telefono'] ?? ''));
    $password = (string)($payload['password'] ?? '');

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

if ($action === 'favorite.set') {
    $user = currentUser($pdo);
    if (!$user) {
        response(['message' => 'Debe iniciar sesión para guardar favoritos.'], 401);
    }

    $parkingId = (int)($payload['parkingId'] ?? 0);
    $active = !empty($payload['active']);
    if ($parkingId <= 0) {
        response(['message' => 'Parqueo inválido.'], 422);
    }

    if ($active) {
        $statement = $pdo->prepare('INSERT INTO favoritos (usuario_id, parqueo_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE parqueo_id = VALUES(parqueo_id)');
        $statement->execute([(int)$user['id'], $parkingId]);
    } else {
        $statement = $pdo->prepare('DELETE FROM favoritos WHERE usuario_id=? AND parqueo_id=?');
        $statement->execute([(int)$user['id'], $parkingId]);
    }

    response(['message' => 'Favorito actualizado.']);
}

if ($action === 'sync.set') {
    $key = (string)($payload['key'] ?? '');
    $data = $payload['data'] ?? null;
    if ($key === '') {
        response(['message' => 'La clave es obligatoria.'], 422);
    }

    if ($key === 'reservas-parkeate' && is_array($data)) {
        syncReservations($pdo, $data);
        response(['message' => 'Reservas sincronizadas.']);
    }

    if ($key === 'parkeate-parqueos-aprobados' && is_array($data)) {
        syncApprovedParkings($pdo, $data);
        response(['message' => 'Parqueos aprobados sincronizados.']);
    }

    if ($key === 'parkeate-usuarios' || $key === 'parkeate-parqueos') {
        // Estas colecciones se obtienen de tablas relacionales; no se sobreescriben por sincronización directa.
        response(['message' => 'Colección gestionada por backend.', 'ignored' => true]);
    }

    setState($pdo, $key, $data);
    response(['message' => 'Estado sincronizado.']);
}

if ($action === 'parkings.list') {
    $rows = $pdo->query('SELECT id, nombre, provincia, zona, ubicacion, precio, espacios, calificacion, disponible, imagen FROM parqueos ORDER BY id')->fetchAll();
    response(['data' => array_map(static function (array $p): array {
        return [
            'id' => (int)$p['id'],
            'nombre' => $p['nombre'],
            'provincia' => $p['provincia'],
            'zona' => $p['zona'],
            'ubicacion' => $p['ubicacion'],
            'precio' => (float)$p['precio'],
            'espacios' => (int)$p['espacios'],
            'calificacion' => (float)$p['calificacion'],
            'disponible' => (bool)$p['disponible'],
            'imagen' => $p['imagen'],
        ];
    }, $rows)]);
}

response(['message' => 'Acción no encontrada.'], 404);
