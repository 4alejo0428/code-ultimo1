<?php
require_once '../../config/session.php';
require_once '../../app/models/Vehicle.php';

if (!isset($_GET['id'])) {
    header('Location: ../../views/admin/vehicles/manage.php');
    exit();
}

$id = intval($_GET['id']);
$vehicleModel = new Vehicle();

if ($vehicleModel->delete($id)) {
    header('Location: ../../views/admin/vehicles/manage.php?deleted=1');
    exit();
} else {
    header('Location: ../../views/admin/vehicles/manage.php?error=1');
    exit();
}
?>
