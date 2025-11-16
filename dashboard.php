<?php
require_once 'config/session.php';
require_once 'includes/functions.php';

// Verificar si el usuario está logueado y es admin
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] != 1) {
    header('Location: login.php');
    exit();
}

$userName = $_SESSION['user_name'] ?? 'Administrador';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrativo - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .dashboard-container {
            background: white;
            border-radius: 15px;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 90%;
            max-width: 700px;
            text-align: center;
        }
        h1 {
            color: #667eea;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        .btn-option {
            width: 100%;
            padding: 1rem;
            margin-top: 1rem;
            font-weight: 600;
            border-radius: 10px;
            transition: 0.3s;
        }
        .btn-option:hover {
            transform: translateY(-3px);
        }
        .logout {
            margin-top: 2rem;
            text-decoration: none;
            font-weight: 600;
            color: #764ba2;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <h1>Panel Administrativo</h1>
        <p class="lead">Bienvenido, <strong><?php echo htmlspecialchars($userName); ?></strong></p>
        <hr>

        <a href="views/admin/users/manage.php" class="btn btn-primary btn-option">
            👥 Gestionar Usuarios
        </a>
        <a href="views/admin/catalog/manage.php" class="btn btn-success btn-option">
            🚗 Gestionar Catálogo
        </a>

        <a href="logout.php" class="logout d-block">Cerrar sesión</a>
    </div>
</body>
</html>
