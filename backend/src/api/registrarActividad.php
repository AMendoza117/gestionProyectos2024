<?php

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Datos del formulario de registro (debe pasarse en el cuerpo de la solicitud POST)
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$folio = $request->folio;
$nombreProyecto = $request->nombreActividad;
$nombreCorto = $request->nombreCorto;
$descripcion = $request->descripcion;
$fechaInicio = $request->fechaInicio;
$fechaTermino = $request->fechaTermino;
$idResponsable = $request->idResponsable;

// Insertar el nuevo proyecto en la base de datos
$consulta = "INSERT INTO Actividades (folio, nombreActividad, nombreCorto, descripcion, fechaInicio, fechaTermino, idResponsable, estadoActividad)
            VALUES ('$folio', '$nombreActividad', '$nombreCorto', '$descripcion', '$fechaInicio', '$fechaTermino', $idResponsable, 'Activo')";


if (mysqli_query($con, $consulta)) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
}

$con->close();


?>