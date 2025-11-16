<?php
require_once 'config/session.php';
require_once 'app/models/Reservation.php';
require_once 'includes/functions.php';

redirectIfNotLoggedIn();

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    header('Location: cart.php');
    exit();
}

$total = 0;
foreach ($cart as $item) {
    $total += $item['total'];
}

$discountPercentage = $_SESSION['discount'] ?? 0;
$discount = ($total * ($discountPercentage / 100));
$finalTotal = $total - $discount;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $paymentMethod = sanitize($_POST['payment_method'] ?? '');

    if (empty($paymentMethod)) {
        $error = 'Selecciona un método de pago';
    } else {
        // Aquí iría la lógica para guardar en BD
        // Por ahora, mostraremos un mensaje de éxito
        $_SESSION['order_total'] = $finalTotal;
        $_SESSION['payment_method'] = $paymentMethod;
        unset($_SESSION['cart']);
        unset($_SESSION['discount']);
        header('Location: order-confirmation.php');
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - CarRental</title>
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
        .payment-option {
            border: 2px solid #ddd;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .payment-option:hover {
            border-color: var(--primary);
            background-color: #f8f9fa;
        }
        .payment-option input[type="radio"]:checked ~ label {
            color: var(--primary);
        }
        .payment-option.active {
            border-color: var(--primary);
            background-color: #f0f4ff;
        }
    </style>
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand text-white" href="index.php">CarRental</a>
        </div>
    </nav>

    <div class="container my-5">
        <h1 class="mb-4">Finalizar Compra</h1>

        <div class="row">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Datos de Facturación</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre Completo</label>
                                <input type="text" class="form-control" value="<?php echo $_SESSION['full_name']; ?>" disabled>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Método de Pago</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST">
                            <div class="payment-option">
                                <input type="radio" id="credit_card" name="payment_method" value="credit_card" required>
                                <label for="credit_card" class="form-label mb-0">
                                    <i class="bi bi-credit-card"></i> Tarjeta de Crédito
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="paypal" name="payment_method" value="paypal">
                                <label for="paypal" class="form-label mb-0">
                                    <i class="bi bi-paypal"></i> PayPal
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="transfer" name="payment_method" value="transfer">
                                <label for="transfer" class="form-label mb-0">
                                    <i class="bi bi-bank"></i> Transferencia Bancaria
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="pay_on_pickup" name="payment_method" value="pay_on_pickup">
                                <label for="pay_on_pickup" class="form-label mb-0">
                                    <i class="bi bi-cash-coin"></i> Pagar al Recoger
                                </label>
                            </div>

                            <div class="mt-4">
                                <button type="submit" class="btn btn-success btn-lg w-100">
                                    <i class="bi bi-check-circle"></i> Confirmar y Pagar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card sticky-top" style="top: 20px;">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Resumen de Compra</h5>
                    </div>
                    <div class="card-body">
                        <?php foreach ($cart as $item): ?>
                            <div class="mb-2 pb-2 border-bottom">
                                <small class="text-muted"><?php echo $item['brand'] . ' ' . $item['model']; ?></small><br>
                                <strong><?php echo formatPrice($item['total']); ?></strong>
                            </div>
                        <?php endforeach; ?>

                        <div class="mt-3 pt-3 border-top">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <strong><?php echo formatPrice($total); ?></strong>
                            </div>
                            <?php if ($discountPercentage > 0): ?>
                                <div class="d-flex justify-content-between mb-2 text-success">
                                    <span>Descuento:</span>
                                    <strong>-<?php echo formatPrice($discount); ?></strong>
                                </div>
                            <?php endif; ?>
                            <div class="d-flex justify-content-between border-top pt-2" style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">
                                <span>Total:</span>
                                <span><?php echo formatPrice($finalTotal); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.querySelectorAll('.payment-option input').forEach(option => {
            option.addEventListener('change', function() {
                document.querySelectorAll('.payment-option').forEach(el => {
                    el.classList.remove('active');
                });
                this.parentElement.classList.add('active');
            });
        });
    </script>
</body>
</html>
