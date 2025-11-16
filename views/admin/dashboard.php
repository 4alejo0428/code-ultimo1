<?php
require_once '../config/session.php';
require_once '../app/models/Vehicle.php';
require_once '../app/models/User.php';

// Instanciar los modelos
$vehicleModel = new Vehicle();
$userModel = new User();

// Consultas
$totalVehicles = count($vehicleModel->getAll());
$totalUsers = count($userModel->getAll());

// ⚠️ Aún no tenemos el modelo de reservas (lo haremos luego)
$totalReservations = 0;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #f4f6f9;
        }
        .sidebar {
            width: 250px;
            height: 100vh;
            background-color: #2c3e50;
            color: #fff;
            position: fixed;
            padding-top: 30px;
        }
        .sidebar a {
            color: #fff;
            text-decoration: none;
            display: block;
            padding: 15px 20px;
            font-weight: 500;
        }
        .sidebar a:hover {
            background-color: #34495e;
        }
        .content {
            margin-left: 250px;
            padding: 40px;
        }
        .card {
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h4 class="text-center mb-4">CarRental Admin</h4>
        <a href="dashboard.php">📊 Dashboard</a>
        <a href="vehicles/manage.php">🚗 Vehículos</a>
        <a href="users/manage.php">👤 Usuarios</a>
        <a href="../logout.php">🚪 Cerrar sesión</a>
    </div>

    <div class="content">
        <h2 class="mb-4">Panel de Administración</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="card p-4 shadow-sm">
                    <h5>Total Vehículos</h5>
                    <h2><?php echo $totalVehicles; ?></h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-4 shadow-sm">
                    <h5>Total Usuarios</h5>
                    <h2><?php echo $totalUsers; ?></h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-4 shadow-sm">
                    <h5>Total Reservas</h5>
                    <h2><?php echo $totalReservations; ?></h2>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
