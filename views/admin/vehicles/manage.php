<?php
require_once '../../../config/session.php';
require_once '../../../app/models/Vehicle.php';

$vehicleModel = new Vehicle();
$vehicles = $vehicleModel->getAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Administrar Vehículos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3">Catálogo de Vehículos</h1>
            <a href="add.php" class="btn btn-primary">+ Agregar Vehículo</a>
        </div>

        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio / Día</th>
                    <th>Transmisión</th>
                    <th>Combustible</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($vehicles as $v): ?>
                    <tr>
                        <td><?= $v['id']; ?></td>
                        <td><?= $v['brand']; ?></td>
                        <td><?= $v['model']; ?></td>
                        <td>$<?= number_format($v['daily_price'], 0, ',', '.'); ?></td>
                        <td><?= $v['transmission']; ?></td>
                        <td><?= $v['fuel']; ?></td>
                        <td>
                            <a href="edit.php?id=<?= $v['id']; ?>" class="btn btn-sm btn-warning">Editar</a>
                            <a href="../../../app/controllers/delete_vehicle.php?id=<?= $v['id']; ?>" 
                               class="btn btn-sm btn-danger"
                               onclick="return confirm('¿Seguro que deseas eliminar este vehículo?')">Eliminar</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
