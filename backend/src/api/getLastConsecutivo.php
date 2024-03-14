<?php
include 'database.php';

$consultaLastConsecutivo = "SELECT MAX(CAST(TRIM(SUBSTRING_INDEX(folio, '-', -1)) AS UNSIGNED)) as lastConsecutivo FROM Proyectos;";
$resultadoLastConsecutivo = mysqli_query($con, $consultaLastConsecutivo);

if ($resultadoLastConsecutivo) {
  $rowLastConsecutivo = mysqli_fetch_assoc($resultadoLastConsecutivo);
  $lastConsecutivo = $rowLastConsecutivo["lastConsecutivo"];

  // Asegurarse de que $lastConsecutivo sea un número
  $lastConsecutivo = $lastConsecutivo !== null ? (int)$lastConsecutivo : 0;

  echo json_encode(['lastConsecutivo' => $lastConsecutivo]);
} else {
  echo json_encode(['error' => 'Error al obtener el último consecutivo desde la base de datos.']);
  exit;
}
?>