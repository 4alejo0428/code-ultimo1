<?php
// <CHANGE> Reservation model for managing car reservations
class Reservation {
    private $db;

    public function __construct() {
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $this->db = $database->connect();
    }

    public function create($data) {
        $query = "INSERT INTO carrito (usuario_id, vehiculo_id, fecha_recogida, fecha_devolucion) 
                  VALUES (:usuario_id, :vehiculo_id, :fecha_recogida, :fecha_devolucion)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $data['usuario_id']);
        $stmt->bindParam(':vehiculo_id', $data['vehiculo_id']);
        $stmt->bindParam(':fecha_recogida', $data['fecha_recogida']);
        $stmt->bindParam(':fecha_devolucion', $data['fecha_devolucion']);

        if ($stmt->execute()) {
            return ['success' => true, 'id' => $this->db->lastInsertId()];
        }
        return ['success' => false, 'error' => 'Error al crear la reserva'];
    }

    public function getByUser($usuario_id) {
        $query = "SELECT c.*, v.marca, v.modelo, v.precio_diario 
                  FROM carrito c 
                  JOIN vehiculos v ON c.vehiculo_id = v.id 
                  WHERE c.usuario_id = :usuario_id 
                  ORDER BY c.fecha_agregado DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM carrito WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete($id) {
        $query = "DELETE FROM carrito WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function calculateDays($fecha_recogida, $fecha_devolucion) {
        $date1 = new DateTime($fecha_recogida);
        $date2 = new DateTime($fecha_devolucion);
        $diff = $date2->diff($date1);
        return max(1, $diff->days);
    }
}
?>
