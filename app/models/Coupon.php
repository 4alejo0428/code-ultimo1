<?php
// <CHANGE> Coupon model for discounts and promotions
class Coupon {
    private $db;

    public function __construct() {
        require_once __DIR__ . '/../../config/database.php';
        $database = new Database();
        $this->db = $database->connect();
    }

    public function getAll() {
        $query = "SELECT * FROM cupones ORDER BY fecha_creacion DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function validate($codigo) {
        $query = "SELECT * FROM cupones WHERE codigo = :codigo AND activo = TRUE 
                  AND DATE(fecha_inicio) <= CURDATE() AND DATE(fecha_fin) >= CURDATE()";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':codigo', $codigo);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO cupones (codigo, tipo, valor, fecha_inicio, fecha_fin, condiciones) 
                  VALUES (:codigo, :tipo, :valor, :inicio, :fin, :condiciones)";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':codigo', $data['codigo']);
        $stmt->bindParam(':tipo', $data['tipo']);
        $stmt->bindParam(':valor', $data['valor']);
        $stmt->bindParam(':inicio', $data['fecha_inicio']);
        $stmt->bindParam(':fin', $data['fecha_fin']);
        $stmt->bindParam(':condiciones', $data['condiciones']);

        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE cupones SET codigo = :codigo, tipo = :tipo, valor = :valor, 
                  fecha_inicio = :inicio, fecha_fin = :fin, activo = :activo WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':codigo', $data['codigo']);
        $stmt->bindParam(':tipo', $data['tipo']);
        $stmt->bindParam(':valor', $data['valor']);
        $stmt->bindParam(':inicio', $data['fecha_inicio']);
        $stmt->bindParam(':fin', $data['fecha_fin']);
        $stmt->bindParam(':activo', $data['activo']);

        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM cupones WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
