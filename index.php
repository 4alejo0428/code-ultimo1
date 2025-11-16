<?php
// Mostrar errores (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config/session.php';
require_once 'app/models/Vehicle.php';
require_once 'includes/functions.php';

// Crear instancia del modelo
$vehicleModel = new Vehicle();

// Sanitizar variables de filtro
$search = sanitize($_GET['search'] ?? '');
$brand = sanitize($_GET['brand'] ?? '');
$minPrice = intval($_GET['min_price'] ?? 0);
$maxPrice = intval($_GET['max_price'] ?? 100000);

// Obtener marcas y vehículos
$brands = $vehicleModel->getBrands();
$vehicles = $vehicleModel->getAll($search, $brand, $minPrice, $maxPrice);

// Determinar si es admin
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] == 1;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo - CarRental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary: #667eea;
            --secondary: #764ba2;
        }
        body { background-color: #f8f9fa; }
        nav { background: linear-gradient(135deg, var(--primary), var(--secondary)); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        nav .navbar-brand { font-weight: 700; font-size: 1.5rem; color: white !important; }
        nav a.nav-link, .text-white { color: white !important; }
        .hero { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 4rem 0; margin-bottom: 2rem; }
        .vehicle-card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: 0.3s; height: 100%; }
        .vehicle-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        .vehicle-image img { width: 100%; height: 200px; object-fit: cover; }
        .btn-primary { background-color: var(--primary); border: none; }
        .btn-primary:hover { background-color: var(--secondary); }
        footer { background-color: #333; color: white; padding: 2rem 0; margin-top: 3rem; }
    </style>
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="index.php">CarRental</a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="ms-auto d-flex gap-2">
                    <?php if (isUserLoggedIn()): ?>
                        <?php if ($isAdmin): ?>
                            <a href="admin/dashboard.php" class="btn btn-light btn-sm">Panel Admin</a>
                        <?php endif; ?>
                        <a href="cart.php" class="btn btn-light btn-sm"><i class="bi bi-cart"></i> Carrito</a>
                        <span class="text-white d-flex align-items-center">
                            Hola, <?php echo htmlspecialchars($_SESSION['full_name'] ?? 'Usuario'); ?>
                        </span>
                        <a href="logout.php" class="btn btn-danger btn-sm">Cerrar Sesión</a>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-light btn-sm">Iniciar Sesión</a>
                        <a href="register.php" class="btn btn-light btn-sm">Registrarse</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <div class="hero">
        <div class="container">
            <h1>Alquila el Vehículo Perfecto</h1>
            <p class="lead">Los mejores precios y la mejor variedad de autos para ti</p>

            <?php if ($isAdmin): ?>
                <a href="admin/add_vehicle.php" class="btn btn-light btn-lg mt-3">
                    <i class="bi bi-plus-circle"></i> Añadir Vehículo
                </a>
            <?php endif; ?>
        </div>
    </div>

    <div class="container">
        <!-- Filtros -->
        <div class="filter-card mb-4">
            <form method="GET" class="row g-3">
                <div class="col-md-3">
                    <input type="text" class="form-control" name="search" placeholder="Buscar marca o modelo..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
                <div class="col-md-3">
                    <select class="form-control" name="brand">
                        <option value="">Todas las marcas</option>
                        <?php foreach ($brands as $b): ?>
                            <option value="<?php echo htmlspecialchars($b); ?>" <?php echo ($brand === $b) ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($b); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-2"><input type="number" class="form-control" name="min_price" placeholder="Precio mín" value="<?php echo $minPrice; ?>"></div>
                <div class="col-md-2"><input type="number" class="form-control" name="max_price" placeholder="Precio máx" value="<?php echo $maxPrice; ?>"></div>
                <div class="col-md-2"><button type="submit" class="btn btn-primary w-100">Buscar</button></div>
            </form>
        </div>

        <!-- Vehículos -->
        <div class="row mb-4">
            <?php if (!empty($vehicles)): ?>
                <?php foreach ($vehicles as $vehicle): ?>
                    <div class="col-md-4 mb-4">
                        <div class="vehicle-card">
                            <div class="vehicle-image">
                                <?php if (!empty($vehicle['image'])): ?>
                                    <img src="uploads/<?php echo htmlspecialchars($vehicle['image']); ?>" alt="Vehículo">
                                <?php else: ?>
                                    <i class="bi bi-car-front fs-1 text-primary"></i>
                                <?php endif; ?>
                            </div>
                            <div class="p-3">
                                <h5 class="vehicle-title"><?php echo htmlspecialchars($vehicle['marca'] . ' ' . $vehicle['modelo']); ?></h5>
                                <p class="text-muted mb-2">
                                    <i class="bi bi-fuel-pump"></i> <?php echo htmlspecialchars($vehicle['combustible']); ?> |
                                    <i class="bi bi-gear"></i> <?php echo htmlspecialchars($vehicle['transmision']); ?> |
                                    <i class="bi bi-people"></i> <?php echo htmlspecialchars($vehicle['capacidad']); ?> pas
                                </p>
                                <div class="vehicle-price"><?php echo number_format($vehicle['precio'], 0, ',', '.'); ?> COP / día</div>

                                <?php if ($isAdmin): ?>
                                    <div class="d-flex justify-content-between mt-2">
                                        <a href="admin/edit_vehicle.php?id=<?php echo $vehicle['id']; ?>" class="btn btn-sm btn-warning">
                                            <i class="bi bi-pencil"></i> Editar
                                        </a>
                                        <a href="admin/delete_vehicle.php?id=<?php echo $vehicle['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('¿Eliminar este vehículo?');">
                                            <i class="bi bi-trash"></i> Eliminar
                                        </a>
                                    </div>
                                <?php else: ?>
                                    <a href="vehicle-detail.php?id=<?php echo $vehicle['id']; ?>" class="btn btn-primary w-100 mt-2">
                                        Ver Detalles
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12">
                    <div class="alert alert-info text-center">No hay vehículos disponibles con los filtros seleccionados</div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <footer>
        <div class="container text-center">
            <p>&copy; 2025 CarRental. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
