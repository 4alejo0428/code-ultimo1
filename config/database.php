<?php
class Database {
    private $host = 'sql113.infinityfree.com';
    private $db_name = 'if0_40360673_automoviles';
    private $user = 'if0_40360673';
    private $password = '7O6we6Ftjc6lX4L';
    private $conn;

    public function getConnection() {  // 👈 cambia connect() por getConnection()
        $this->conn = null;
        try {
            $this->conn = new PDO(
                'mysql:host=' . $this->host . ';dbname=' . $this->db_name,
                $this->user,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo 'Error: ' . $e->getMessage();
        }
        return $this->conn;
    }
}
?>
