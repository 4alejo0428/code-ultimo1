<?php
require_once 'config/session.php';

redirectIfNotLoggedIn();

if (!isset($_SESSION['order_total'])) {
    header('Location: index.php');
    exit();
}

$orderTotal = $_SESSION['order_total'];
$paymentMethod = $_SESSION['payment_method'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Orden - CarRental</title>
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
        .success-container {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            margin: 3rem auto;
        }
        .success-icon {
            font-size: 5rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand text-white" href="index.php">CarRental</a>
        </div>
    </nav>

    <div class="container">
        <div class="success-container">
            <div class="success-icon">
                <i class="bi bi-check-circle"></i>
            </div>
            <h1 class="mb-3">Orden Confirmada</h1>
            <p class="text-muted mb-3">Tu reserva ha sido procesada exitosamente</p>
            
            <div class="card mb-3">
                <div class="card-body">
                    <p><strong>Total de la Orden:</strong></p>
                    <h3 style="color: var(--primary);">$<?php echo number_format($orderTotal, 2); ?></h3>
                    
                    <hr>
                    
                    <p><strong>Método de Pago:</strong></p>
                    <p><?php echo ucwords(str_replace('_', ' ', $paymentMethod)); ?></p>
                </div>
            </div>

            <p class="text-muted">Se ha enviado un correo de confirmación a tu email</p>

            <a href="index.php" class="btn btn-primary btn-lg">
                Volver al Catálogo
            </a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
