<?php
session_start();

// Verificar sesión activa
function isUserLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

function redirectIfNotLoggedIn() {
    if (!isUserLoggedIn()) {
        header('Location: /login.php');
        exit();
    }
}

function redirectIfNotAdmin() {
    if (!isAdmin()) {
        header('Location: /index.php');
        exit();
    }
}

function logout() {
    session_destroy();
    header('Location: /index.php');
    exit();
}
