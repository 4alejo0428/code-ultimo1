<?php
require_once 'config/session.php';
require_once 'app/models/Vehicle.php';
require_once 'includes/functions.php';

$vehicleId = intval($_GET['id'] ?? 0);
$vehicleModel = new Vehicle();
$vehicle = $vehicleModel->getById($vehicleId);

if (!$vehicle) {
    header('Location: index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isUserLoggedIn()) {
    $startDate = sanitize($_POST['start_date'] ?? '');
    $endDate = sanitize($_POST['end_date'] ?? '');

    if (empty($startDate) || empty($endDate)) {
        $error = 'Por favor completa las fechas';
    } else {
        // Guardar en sesión el carrito
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        $cartItem = [
            'vehicle_id' => $vehicleId,
            'brand' => $vehicle['brand'],
            'model' => $vehicle['model'],
            'daily_price' => $vehicle['daily_price'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days' => calculateDays($startDate, $endDate),
            'total' => calculateRentalTotal($vehicle['daily_price'], calculateDays($startDate, $endDate))
        ];

        $_SESSION['cart'][] = $cartItem;
        header('Location: cart.php');
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $vehicle['brand'] . ' ' . $vehicle['model']; ?> - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary: #667eea;
            --secondary: #764ba2;
        }
        body {
            background-color: #f8f9fa;
        }
        nav {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        }
        .vehicle-image {
            width: 100%;
            height: 300px;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            color: var(--primary);
            border-radius: 8px;
        }
        .vehicle-specs {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            margin-top: 2rem;
        }
        .spec-row {
            display: flex;
            justify-content: space-between;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
        }
        .spec-row:last-child {
            border-bottom: none;
        }
        .price-section {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 2rem;
            border-radius: 8px;
            margin-top: 2rem;
        }
        .price-section h2 {
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);">
        <div class="container">
            <a class="navbar-brand text-white" href="index.php">CarRental</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="ms-auto d-flex gap-2">
                    <a href="index.php" class="btn btn-light btn-sm">Catálogo</a>
                    <a href="cart.php" class="btn btn-light btn-sm"><i class="bi bi-cart"></i> Carrito</a>
                    <?php if (isUserLoggedIn()): ?>
                        <a href="logout.php" class="btn btn-danger btn-sm">Cerrar Sesión</a>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-light btn-sm">Iniciar Sesión</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <a href="index.php" class="mb-3 d-inline-block">
            <i class="bi bi-arrow-left"></i> Volver al Catálogo
        </a>

        <div class="row">
            <div class="col-md-6">
                <div class="vehicle-image">
                    <i class="bi bi-car-front"></i>
                </div>
            </div>

            <div class="col-md-6">
                <h1><?php echo $vehicle['brand'] . ' ' . $vehicle['model']; ?></h1>
                <p class="text-muted">Categoría: <?php echo $vehicle['category']; ?></p>

                <div class="vehicle-specs">
                    <div class="spec-row">
                        <strong>Transmisión:</strong>
                        <span><?php echo $vehicle['transmission']; ?></span>
                    </div>
                    <div class="spec-row">
                        <strong>Combustible:</strong>
                        <span><?php echo $vehicle['fuel']; ?></span>
                    </div>
                    <div class="spec-row">
                        <strong>Capacidad:</strong>
                        <span><?php echo $vehicle['capacity']; ?> pasajeros</span>
                    </div>
                    <div class="spec-row">
                        <strong>Precio por Día:</strong>
                        <span style="color: var(--primary); font-weight: 700; font-size: 1.2rem;">
                            <?php echo formatPrice($vehicle['daily_price']); ?>
                        </span>
                    </div>
                </div>

                <?php if (isUserLoggedIn()): ?>
                    <form method="POST" class="mt-4">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="start_date" class="form-label">Fecha de Recogida</label>
                                <input type="datetime-local" class="form-control" id="start_date" name="start_date" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="end_date" class="form-label">Fecha de Devolución</label>
                                <input type="datetime-local" class="form-control" id="end_date" name="end_date" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-100">
                            <i class="bi bi-cart-plus"></i> Agregar al Carrito
                        </button>
                    </form>
                <?php else: ?>
                    <div class="alert alert-info mt-4">
                        <strong>Inicia sesión para alquilar este vehículo</strong><br>
                        <a href="login.php" class="btn btn-primary btn-sm mt-2">Iniciar Sesión</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
