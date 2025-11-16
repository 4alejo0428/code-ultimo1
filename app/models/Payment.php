<?php
class Payment {
    private $db;

    public function __construct() {
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $this->db = $database->connect();
    }

    public function createReservation($data) {
        $query = "INSERT INTO reservas (usuario_id, vehiculo_id, fecha_recogida, fecha_devolucion, costo_total, metodo_pago, estado) 
                  VALUES (:usuario_id, :vehiculo_id, :fecha_recogida, :fecha_devolucion, :costo_total, :metodo_pago, :estado)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $data['usuario_id']);
        $stmt->bindParam(':vehiculo_id', $data['vehiculo_id']);
        $stmt->bindParam(':fecha_recogida', $data['fecha_recogida']);
        $stmt->bindParam(':fecha_devolucion', $data['fecha_devolucion']);
        $stmt->bindParam(':costo_total', $data['costo_total']);
        $stmt->bindParam(':metodo_pago', $data['metodo_pago']);
        $stmt->bindParam(':estado', $data['estado']);

        return $stmt->execute();
    }

    public function getByUser($usuario_id) {
        $query = "SELECT r.*, v.marca as vehiculo_marca, v.modelo as vehiculo_modelo 
                  FROM reservas r 
                  JOIN vehiculos v ON r.vehiculo_id = v.id 
                  WHERE r.usuario_id = :usuario_id 
                  ORDER BY r.fecha_creacion DESC";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':usuario_id', $usuario_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
