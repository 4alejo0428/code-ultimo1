<?php
require_once '../../../config/session.php';
require_once '../../../app/models/User.php';

$userModel = new User();
$message = '';

if (!isset($_GET['id'])) {
    header('Location: manage.php');
    exit();
}

$id = intval($_GET['id']);
$user = $userModel->getById($id);

if (!$user) {
    die("<div style='padding:20px; color:red;'>Usuario no encontrado.</div>");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newRole = intval($_POST['role']);
    if ($userModel->updateRole($id, $newRole)) {
        $message = '<div class="alert alert-success">Rol actualizado correctamente.</div>';
        $user = $userModel->getById($id);
    } else {
        $message = '<div class="alert alert-danger">Error al actualizar el rol.</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Usuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
    <h1 class="h3 mb-4">Editar Usuario</h1>
    <?= $message; ?>

    <form method="POST" class="bg-white p-4 rounded shadow-sm">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" value="<?= htmlspecialchars($user['nombre']); ?>" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Correo</label>
            <input type="email" class="form-control" value="<?= htmlspecialchars($user['email']); ?>" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Rol</label>
            <select name="role" class="form-control">
                <option value="1" <?= $user['rol'] == 1 ? 'selected' : ''; ?>>Administrador</option>
                <option value="2" <?= $user['rol'] == 2 ? 'selected' : ''; ?>>Cliente</option>
            </select>
        </div>
        <button type="submit" class="btn btn-success">Guardar Cambios</button>
        <a href="manage.php" class="btn btn-secondary">Volver</a>
    </form>
</div>
</body>
</html>
