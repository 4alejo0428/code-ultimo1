<?php
require_once '../../../config/session.php';
require_once '../../../app/models/Vehicle.php';

$vehicleModel = new Vehicle();
$message = '';

if (!isset($_GET['id'])) {
    header('Location: manage.php');
    exit();
}

$id = intval($_GET['id']);
$vehicle = $vehicleModel->getById($id);

if (!$vehicle) {
    die("<div style='padding:20px; color:red;'>Vehículo no encontrado.</div>");
}

// Guardar cambios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'brand' => $_POST['brand'],
        'model' => $_POST['model'],
        'year' => $_POST['year'],
        'fuel' => $_POST['fuel'],
        'transmission' => $_POST['transmission'],
        'capacity' => $_POST['capacity'],
        'daily_price' => $_POST['daily_price'],
        'description' => $_POST['description']
    ];

    if ($vehicleModel->update($id, $data)) {
        $message = '<div class="alert alert-success">Vehículo actualizado correctamente.</div>';
        $vehicle = $vehicleModel->getById($id); // refrescar datos
    } else {
        $message = '<div class="alert alert-danger">Error al actualizar el vehículo.</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Vehículo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
    <h1 class="h3 mb-4">Editar Vehículo</h1>
    <?= $message; ?>

    <form method="POST" class="bg-white p-4 rounded shadow-sm">
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Marca</label>
                <input type="text" class="form-control" name="brand" value="<?= htmlspecialchars($vehicle['marca']); ?>" required>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">Modelo</label>
                <input type="text" class="form-control" name="model" value="<?= htmlspecialchars($vehicle['modelo']); ?>" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-3">
                <label class="form-label">Año</label>
                <input type="number" class="form-control" name="year" value="<?= htmlspecialchars($vehicle['anio']); ?>">
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Transmisión</label>
                <input type="text" class="form-control" name="transmission" value="<?= htmlspecialchars($vehicle['transmision']); ?>">
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Combustible</label>
                <input type="text" class="form-control" name="fuel" value="<?= htmlspecialchars($vehicle['combustible']); ?>">
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-3">
                <label class="form-label">Capacidad</label>
                <input type="text" class="form-control" name="capacity" value="<?= htmlspecialchars($vehicle['capacidad']); ?>">
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Precio / Día</label>
                <input type="number" class="form-control" name="daily_price" value="<?= htmlspecialchars($vehicle['precio']); ?>" required>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" name="description" rows="3"><?= htmlspecialchars($vehicle['descripcion']); ?></textarea>
        </div>
        <button type="submit" class="btn btn-success">Guardar Cambios</button>
        <a href="manage.php" class="btn btn-secondary">Volver</a>
    </form>
</div>
</body>
</html>
