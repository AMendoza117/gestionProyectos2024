<?php
include 'database.php';
header("Content-Type: application/json");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$responsables = [];

$sql = "SELECT idLiderProyecto, nombre FROM LideresProyecto"; // Reemplaza con tu consulta SQL
$result = mysqli_query($con, $sql);

if ($result) {
  while ($row = mysqli_fetch_assoc($result)) {
    $responsables[] = [
      'idLiderProyecto' => $row['idLiderProyecto'],
      'nombre' => $row['nombre'],
    ];
  }

  echo json_encode($responsables);
} else {
  http_response_code(500); // Cambiar código de respuesta según sea necesario
  echo json_encode(['error' => 'Error al cargar responsables']);
}
?>
