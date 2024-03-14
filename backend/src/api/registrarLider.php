<?php

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Datos del formulario de registro (debe pasarse en el cuerpo de la solicitud POST)
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$nombre = $request->nombre;

// Insertar el nuevo proyecto en la base de datos
$consulta = "INSERT INTO LideresProyecto (nombre)
            VALUES ('$nombre')";


if (mysqli_query($con, $consulta)) {
  echo json_encode(['success' => true, $nombre]);
} else {
  echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
}

$con->close();


?>