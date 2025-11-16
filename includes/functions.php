<?php

// Hash de contraseña
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Verificar contraseña
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Sanitizar entrada
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Validar email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Formatear precio
function formatPrice($price) {
    return '$' . number_format($price, 2);
}

// Calcular días de renta
function calculateDays($startDate, $endDate) {
    $start = new DateTime($startDate);
    $end = new DateTime($endDate);
    $diff = $end->diff($start);
    return max(1, $diff->days);
}

// Calcular total de renta
function calculateRentalTotal($dailyPrice, $days, $discount = 0) {
    $total = $dailyPrice * $days;
    $discountAmount = ($total * $discount) / 100;
    return $total - $discountAmount;
}
