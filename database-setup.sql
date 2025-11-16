CREATE DATABASE IF NOT EXISTS car_rental;
USE car_rental;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    nationality VARCHAR(50),
    gender VARCHAR(10),
    role ENUM('client', 'admin', 'premium') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    daily_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    transmission VARCHAR(20),
    fuel VARCHAR(20),
    capacity INT,
    image VARCHAR(255),
    status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5, 2) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE additional_charges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);
