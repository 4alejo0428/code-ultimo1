<?php
require_once '../../config/session.php';
require_once '../../app/models/User.php';

if (!isset($_GET['id'])) {
    header('Location: ../../views/admin/users/manage.php');
    exit();
}

$id = intval($_GET['id']);
$userModel = new User();

if ($userModel->deleteUser($id)) {
    header('Location: ../../views/admin/users/manage.php?deleted=1');
    exit();
} else {
    header('Location: ../../views/admin/users/manage.php?error=1');
    exit();
}
?>
