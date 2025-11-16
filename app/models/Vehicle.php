<?php
class Vehicle {
    private $conn;

    public function __construct() {
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
			$this->conn = $database->getConnection();

    }

    /**
     * Obtener todas las marcas de vehículos (sin repetir)
     */
    public function getBrands() {
        try {
            $query = "SELECT DISTINCT marca FROM vehiculos ORDER BY marca ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            error_log("Error en getBrands(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener todos los vehículos (con filtros opcionales)
     */
    public function getAll($search = '', $brand = '', $minPrice = 0, $maxPrice = 1000000) {
        try {
            $query = "SELECT * FROM vehiculos WHERE precio BETWEEN :min AND :max";

            if ($search !== '') {
                $query .= " AND (marca LIKE :search OR modelo LIKE :search)";
            }
            if ($brand !== '') {
                $query .= " AND marca = :brand";
            }

            $query .= " ORDER BY precio ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':min', $minPrice, PDO::PARAM_INT);
            $stmt->bindValue(':max', $maxPrice, PDO::PARAM_INT);

            if ($search !== '') {
                $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
            }
            if ($brand !== '') {
                $stmt->bindValue(':brand', $brand, PDO::PARAM_STR);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getAll(): " . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener un vehículo por su ID
     */
    public function getById($id) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM vehiculos WHERE id = :id");
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en getById(): " . $e->getMessage());
            return null;
        }
    }

    /**
     * Agregar un nuevo vehículo
     */
    public function add($data) {
        try {
            $stmt = $this->conn->prepare("
                INSERT INTO vehiculos (marca, modelo, anio, combustible, transmision, capacidad, precio, descripcion)
                VALUES (:marca, :modelo, :anio, :combustible, :transmision, :capacidad, :precio, :descripcion)
            ");

            return $stmt->execute([
                ':marca' => $data['brand'],
                ':modelo' => $data['model'],
                ':anio' => $data['year'] ?? null,
                ':combustible' => $data['fuel'],
                ':transmision' => $data['transmission'],
                ':capacidad' => $data['capacity'],
                ':precio' => $data['daily_price'],
                ':descripcion' => $data['description'] ?? ''
            ]);
        } catch (PDOException $e) {
            error_log("Error en add(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Actualizar los datos de un vehículo
     */
    public function update($id, $data) {
        try {
            $stmt = $this->conn->prepare("
                UPDATE vehiculos
                SET marca = :marca,
                    modelo = :modelo,
                    anio = :anio,
                    combustible = :combustible,
                    transmision = :transmision,
                    capacidad = :capacidad,
                    precio = :precio,
                    descripcion = :descripcion
                WHERE id = :id
            ");

            return $stmt->execute([
                ':marca' => $data['brand'],
                ':modelo' => $data['model'],
                ':anio' => $data['year'],
                ':combustible' => $data['fuel'],
                ':transmision' => $data['transmission'],
                ':capacidad' => $data['capacity'],
                ':precio' => $data['daily_price'],
                ':descripcion' => $data['description'],
                ':id' => $id
            ]);
        } catch (PDOException $e) {
            error_log("Error en update(): " . $e->getMessage());
            return false;
        }
    }

    /**
     * Eliminar vehículo por ID
     */
    public function delete($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM vehiculos WHERE id = :id");
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error en delete(): " . $e->getMessage());
            return false;
        }
    }
}
?>
