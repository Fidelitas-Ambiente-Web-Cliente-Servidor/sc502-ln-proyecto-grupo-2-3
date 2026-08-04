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

function database(): PDO {
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

function action(): string {
    return strtolower(trim((string)($_GET['action'] ?? 'list')));
}

function userById(PDO $pdo, int $id): ?array {
    $statement = $pdo->prepare('SELECT id, nombre, correo, telefono, rol, estado FROM usuarios WHERE id = ? LIMIT 1');
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

function requireUser(PDO $pdo): array {
    $user = currentUser($pdo);
    if (!$user) {
        response(['message' => 'Debe iniciar sesión.'], 401);
    }
    return $user;
}

function requireAdmin(PDO $pdo): array {
    $user = requireUser($pdo);
    if (($user['rol'] ?? '') !== 'Administrador') {
        response(['message' => 'Acceso exclusivo para administradores.'], 403);
    }
    return $user;
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

function mapParking(array $row): array {
    return [
        'id' => (int)$row['id'],
        'nombre' => (string)$row['nombre'],
        'provincia' => (string)$row['provincia'],
        'zona' => (string)$row['zona'],
        'ubicacion' => (string)$row['ubicacion'],
        'precio' => (float)$row['precio'],
        'espacios' => (int)$row['espacios'],
        'calificacion' => (float)$row['calificacion'],
        'disponible' => (bool)$row['disponible'],
        'imagen' => (string)($row['imagen'] ?? ''),
        'origen' => (string)($row['origen'] ?? 'base'),
    ];
}

function mapReservation(array $row): array {
    return [
        'id' => (string)($row['external_id'] ?: ('res-' . $row['id'])),
        'usuario' => (string)$row['usuario'],
        'placa' => (string)$row['placa'],
        'parqueo' => (string)$row['parqueo'],
        'espacio' => (string)$row['espacio'],
        'fecha' => (string)$row['fecha'],
        'hora' => (string)$row['hora'],
        'horaSalida' => (string)$row['hora_salida'],
        'estado' => (string)$row['estado'],
        'monto' => (float)$row['monto'],
    ];
}
