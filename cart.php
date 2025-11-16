<?php
require_once 'config/session.php';
require_once 'includes/functions.php';
require_once 'app/models/Coupon.php';

redirectIfNotLoggedIn();

$cart = $_SESSION['cart'] ?? [];
$coupon = null;
$discountPercentage = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['apply_coupon'])) {
        $couponCode = sanitize($_POST['coupon_code'] ?? '');
        $couponModel = new Coupon();
        $coupon = $couponModel->validate($couponCode);
        
        if ($coupon) {
            $discountPercentage = $coupon['discount'];
            $_SESSION['discount'] = $discountPercentage;
        } else {
            $error = 'Cupón no válido';
        }
    } elseif (isset($_POST['remove_item'])) {
        $index = intval($_POST['remove_item']);
        if (isset($cart[$index])) {
            unset($cart[$index]);
            $cart = array_values($cart);
            $_SESSION['cart'] = $cart;
        }
    }
}

$total = 0;
foreach ($cart as $item) {
    $total += $item['total'];
}
$discount = ($total * ($discountPercentage / 100));
$finalTotal = $total - $discount;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito - CarRental</title>
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
        .cart-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .summary-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 20px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        .summary-row:last-child {
            border-bottom: none;
            border-top: 2px solid var(--primary);
            padding-top: 1rem;
            margin-top: 1rem;
            font-weight: 700;
            font-size: 1.2rem;
        }
        .btn-checkout {
            background-color: var(--primary);
            border: none;
            padding: 0.75rem;
            font-weight: 600;
            margin-top: 1rem;
        }
        .btn-checkout:hover {
            background-color: var(--secondary);
        }
    </style>
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand text-white" href="index.php">CarRental</a>
            <a href="index.php" class="btn btn-light btn-sm ms-auto">
                <i class="bi bi-arrow-left"></i> Continuar Comprando
            </a>
        </div>
    </nav>

    <div class="container my-5">
        <h1 class="mb-4">Carrito de Compras</h1>

        <div class="row">
            <div class="col-md-8">
                <?php if (count($cart) > 0): ?>
                    <?php foreach ($cart as $index => $item): ?>
                        <div class="cart-item">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5><?php echo $item['brand'] . ' ' . $item['model']; ?></h5>
                                    <p class="text-muted">
                                        Desde: <?php echo date('d/m/Y H:i', strtotime($item['start_date'])); ?><br>
                                        Hasta: <?php echo date('d/m/Y H:i', strtotime($item['end_date'])); ?><br>
                                        Duración: <?php echo $item['days']; ?> día(s)
                                    </p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <div class="h5" style="color: var(--primary);">
                                        <?php echo formatPrice($item['total']); ?>
                                    </div>
                                    <form method="POST" class="mt-2">
                                        <input type="hidden" name="remove_item" value="<?php echo $index; ?>">
                                        <button type="submit" class="btn btn-danger btn-sm">
                                            <i class="bi bi-trash"></i> Eliminar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>

                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Aplicar Cupón de Descuento</h5>
                            <form method="POST" class="d-flex gap-2">
                                <input type="text" class="form-control" name="coupon_code" placeholder="Ingresa código del cupón">
                                <button type="submit" name="apply_coupon" class="btn btn-outline-primary">
                                    Aplicar
                                </button>
                            </form>
                            <?php if (isset($error)): ?>
                                <div class="alert alert-danger mt-2"><?php echo $error; ?></div>
                            <?php endif; ?>
                            <?php if ($coupon): ?>
                                <div class="alert alert-success mt-2">
                                    Cupón aplicado: <?php echo $coupon['code']; ?> (<?php echo $coupon['discount']; ?>% descuento)
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="alert alert-info">
                        <h5>Tu carrito está vacío</h5>
                        <a href="index.php" class="btn btn-primary mt-2">Ir al Catálogo</a>
                    </div>
                <?php endif; ?>
            </div>

            <?php if (count($cart) > 0): ?>
                <div class="col-md-4">
                    <div class="summary-card">
                        <h5 class="mb-3">Resumen de Compra</h5>
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span><?php echo formatPrice($total); ?></span>
                        </div>
                        <?php if ($discountPercentage > 0): ?>
                            <div class="summary-row">
                                <span>Descuento (<?php echo $discountPercentage; ?>%):</span>
                                <span>-<?php echo formatPrice($discount); ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="summary-row">
                            <span>Total:</span>
                            <span><?php echo formatPrice($finalTotal); ?></span>
                        </div>
                        <a href="checkout.php" class="btn btn-primary btn-checkout w-100">
                            Proceder al Pago
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
