<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config/session.php';
require_once 'app/models/User.php';
require_once 'includes/functions.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);


$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Por favor completa ambos campos';
    } elseif (!isValidEmail($email)) {
        $error = 'Correo electrónico no válido';
    } else {
        $user = new User();
        $result = $user->login($email, $password);

        if ($result['success']) {
            header('Location: index.php');
            exit;
        } else {
            $error = $result['error'] ?? 'Error al iniciar sesión';
        }
    }
}

if (isUserLoggedIn()) {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 420px;
        }
        .login-container h1 {
            text-align: center;
            color: #667eea;
            font-weight: 700;
            margin-bottom: 1.5rem;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-login {
            background-color: #667eea;
            border: none;
            font-weight: 600;
            padding: 0.75rem;
            margin-top: 1rem;
        }
        .btn-login:hover {
            background-color: #764ba2;
        }
        .register-link {
            text-align: center;
            margin-top: 1rem;
        }
        .register-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>CarRental</h1>
        <h5 class="text-center mb-4">Iniciar Sesión</h5>

        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>

            <button type="submit" class="btn btn-primary btn-login w-100">Ingresar</button>

            <div class="register-link">
                ¿No tienes cuenta? <a href="register.php">Regístrate aquí</a>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
