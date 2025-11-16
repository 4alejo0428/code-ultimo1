<?php
require_once '../../../config/session.php';
require_once '../../../app/models/User.php';

$userModel = new User();
$users = $userModel->getAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Administrar Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Usuarios Registrados</h1>
        <a href="../dashboard.php" class="btn btn-secondary">Volver al Panel</a>
    </div>

    <?php if (isset($_GET['deleted'])): ?>
        <div class="alert alert-success">Usuario eliminado correctamente.</div>
    <?php elseif (isset($_GET['error'])): ?>
        <div class="alert alert-danger">Error al eliminar el usuario.</div>
    <?php endif; ?>

    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $u): ?>
                <tr>
                    <td><?= $u['id']; ?></td>
                    <td><?= htmlspecialchars($u['nombre']); ?></td>
                    <td><?= htmlspecialchars($u['email']); ?></td>
                    <td><?= ($u['rol'] == 1) ? 'Admin' : 'Cliente'; ?></td>
                    <td><?= isset($u['activo']) && $u['activo'] ? 'Activo' : 'Inactivo'; ?></td>
                    <td>
                        <a href="edit.php?id=<?= $u['id']; ?>" class="btn btn-sm btn-warning">Editar</a>
                        <a href="../../../app/controllers/delete_user.php?id=<?= $u['id']; ?>" 
                           class="btn btn-sm btn-danger"
                           onclick="return confirm('¿Seguro que deseas eliminar este usuario?')">Eliminar</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body>
</html>
