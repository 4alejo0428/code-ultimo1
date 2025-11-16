<?php
require_once '../../../config/session.php';
require_once '../../../app/models/Vehicle.php';

$vehicleModel = new Vehicle();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'brand' => $_POST['brand'],
        'model' => $_POST['model'],
        'daily_price' => $_POST['daily_price'],
        'transmission' => $_POST['transmission'],
        'fuel' => $_POST['fuel'],
        'capacity' => $_POST['capacity']
    ];

    if ($vehicleModel->add($data)) {
        $message = '<div class="alert alert-success">Vehículo agregado correctamente</div>';
    } else {
        $message = '<div class="alert alert-danger">Error al agregar el vehículo</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agregar Vehículo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
    <h1 class="h3 mb-4">Agregar Vehículo</h1>
    <?= $message; ?>

    <form method="POST" class="bg-white p-4 rounded shadow-sm">
        <div class="mb-3">
            <label class="form-label">Marca</label>
            <input type="text" class="form-control" name="brand" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Modelo</label>
            <input type="text" class="form-control" name="model" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Precio por día</label>
            <input type="number" class="form-control" name="daily_price" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Transmisión</label>
            <input type="text" class="form-control" name="transmission">
        </div>
        <div class="mb-3">
            <label class="form-label">Combustible</label>
            <input type="text" class="form-control" name="fuel">
        </div>
        <div class="mb-3">
            <label class="form-label">Capacidad (número de pasajeros)</label>
            <input type="text" class="form-control" name="capacity">
        </div>
        <button type="submit" class="btn btn-success">Guardar</button>
        <a href="manage.php" class="btn btn-secondary">Volver</a>
    </form>
</div>
</body>
</html>
