<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config/session.php';
require_once 'app/models/User.php';
require_once 'includes/functions.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    $phone = sanitize($_POST['phone'] ?? '');
    $address = sanitize($_POST['address'] ?? '');
    $nationality = sanitize($_POST['nationality'] ?? '');
    $gender = sanitize($_POST['gender'] ?? '');

    if (empty($fullName) || empty($email) || empty($password) || empty($phone)) {
        $error = 'Por favor completa todos los campos requeridos';
    } elseif (!isValidEmail($email)) {
        $error = 'Email no válido';
    } elseif ($password !== $confirmPassword) {
        $error = 'Las contraseñas no coinciden';
    } elseif (strlen($password) < 6) {
        $error = 'La contraseña debe tener al menos 6 caracteres';
    } else {
        $user = new User();

        if ($user->emailExists($email)) {
            $error = 'Este email ya está registrado';
        } else {
            // ✅ Enviamos los datos como array (forma correcta)
            $registro = $user->register([
                'nombre'       => $fullName,
                'email'        => $email,
                'contrasena'   => $password,
                'telefono'     => $phone,
                'direccion'    => $address,
                'nacionalidad' => $nationality,
                'genero'       => $gender
            ]);

            if ($registro['success']) {
                $success = 'Registro exitoso. Por favor inicia sesión.';
                header('Refresh: 2; url=login.php');
            } else {
                $error = 'Error en el registro. Intenta nuevamente.';
            }
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
    <title>Registro - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 0;
        }
        .register-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            margin: 0 auto;
        }
        .register-container h1 {
            color: #667eea;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 700;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-register {
            background-color: #667eea;
            border: none;
            padding: 0.75rem;
            font-weight: 600;
            margin-top: 1rem;
        }
        .btn-register:hover {
            background-color: #764ba2;
        }
        .login-link {
            text-align: center;
            margin-top: 1.5rem;
        }
        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="register-container">
        <h1>CarRental</h1>
        <h5 class="text-center mb-4">Crear Cuenta</h5>

        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="full_name" class="form-label">Nombre Completo *</label>
                    <input type="text" class="form-control" id="full_name" name="full_name" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">Contraseña *</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="confirm_password" class="form-label">Confirmar Contraseña *</label>
                    <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Teléfono *</label>
                    <input type="tel" class="form-control" id="phone" name="phone" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="gender" class="form-label">Género</label>
                    <select class="form-control" id="gender" name="gender">
                        <option value="">Selecciona...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>

            <div class="mb-3">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="address" name="address">
            </div>

            <div class="mb-3">
                <label for="nationality" class="form-label">Nacionalidad</label>
                <input type="text" class="form-control" id="nationality" name="nationality">
            </div>

            <button type="submit" class="btn btn-primary btn-register w-100">Registrarse</button>
        </form>

        <div class="login-link">
            ¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
