<?php
// Modelo User para autenticación y gestión de usuarios
class User {
    private $db;

    public function __construct() {
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $this->db = $database->getConnection(); // Usamos el método correcto
    }

    public function register($data) {
        $query = "INSERT INTO usuarios 
            (nombre, email, contrasena, telefono, direccion, nacionalidad, genero, codigo_verificacion) 
            VALUES (:nombre, :email, :contrasena, :telefono, :direccion, :nacionalidad, :genero, :codigo)";
        
        $stmt = $this->db->prepare($query);
        
        // Hash de contraseña y código de verificación
        $hashedPassword = password_hash($data['contrasena'], PASSWORD_BCRYPT);
        $verificationCode = bin2hex(random_bytes(16));

        // Convertir el género de texto a ID (según tu tabla generos)
        $generoId = null;
        if (isset($data['genero'])) {
            $genero = strtolower(trim($data['genero']));
            if ($genero === 'masculino') {
                $generoId = 1;
            } elseif ($genero === 'femenino') {
                $generoId = 2;
            } else {
                $generoId = null; // Otros géneros o no especificado
            }
        }

        // Vincular parámetros
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':contrasena', $hashedPassword);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':direccion', $data['direccion']);
        $stmt->bindParam(':nacionalidad', $data['nacionalidad']);
        $stmt->bindParam(':genero', $generoId);
        $stmt->bindParam(':codigo', $verificationCode);

        // Ejecutar la inserción
        if ($stmt->execute()) {
            return [
                'success' => true,
                'verification_code' => $verificationCode
            ];
        }

        return [
            'success' => false,
            'error' => 'Error al registrar usuario'
        ];
    }

    public function login($email, $password) {
        $query = "SELECT id, nombre, email, contrasena, rol, activo 
                  FROM usuarios 
                  WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['contrasena'])) {
            if ($user['activo']) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['rol'];
                $_SESSION['user_name'] = $user['nombre'];
                return ['success' => true, 'user' => $user];
            } else {
                return ['success' => false, 'error' => 'Cuenta no verificada'];
            }
        }

        return ['success' => false, 'error' => 'Email o contraseña incorrectos'];
    }

    public function getById($id) {
        $query = "SELECT * FROM usuarios WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $query = "SELECT id, nombre, email, rol, activo, fecha_registro 
                  FROM usuarios 
                  ORDER BY fecha_registro DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateUser($id, $data) {
        $query = "UPDATE usuarios SET 
                    nombre = :nombre, 
                    email = :email, 
                    telefono = :telefono, 
                    direccion = :direccion, 
                    nacionalidad = :nacionalidad, 
                    genero = :genero 
                  WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':direccion', $data['direccion']);
        $stmt->bindParam(':nacionalidad', $data['nacionalidad']);
        $stmt->bindParam(':genero', $data['genero']);

        return $stmt->execute();
    }

    public function updateRole($id, $role) {
        $query = "UPDATE usuarios SET rol = :role WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function deleteUser($id) {
        $query = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function verifyEmail($code) {
        $query = "UPDATE usuarios SET activo = TRUE WHERE codigo_verificacion = :code";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':code', $code);
        return $stmt->execute();
    }

    public function emailExists($email) {
        $query = "SELECT id FROM usuarios WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
