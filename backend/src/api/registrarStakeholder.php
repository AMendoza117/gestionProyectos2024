<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Datos del formulario de registro (debe pasarse en el cuerpo de la solicitud POST)
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$idProyecto = $request->idProyecto;
$nombreCompleto = $request->nombreCompleto;
$correoElectronico = $request->correoElectronico;
$telefono = $request->telefono;

// Consulta para verificar si el correo electrónico ya existe
$consulta_verificacion = "SELECT COUNT(*) AS total FROM Stakeholders WHERE correoElectronico = ? AND idProyecto = $idProyecto";
$stmt_verificacion = mysqli_prepare($con, $consulta_verificacion);
mysqli_stmt_bind_param($stmt_verificacion, "s", $correoElectronico);
mysqli_stmt_execute($stmt_verificacion);
mysqli_stmt_bind_result($stmt_verificacion, $total);
mysqli_stmt_fetch($stmt_verificacion);
mysqli_stmt_close($stmt_verificacion);

// Si el correo electrónico ya existe, no lo agregamos nuevamente
if ($total > 0) {
    echo json_encode(['success' => false, 'error' => 'El correo electrónico ya existe en la base de datos']);
    exit; // Terminamos la ejecución del script
}

// Sentencia preparada para prevenir inyecciones SQL
$consulta = "INSERT INTO Stakeholders (nombreCompleto, correoElectronico, telefono, idProyecto)
            VALUES (?, ?, ?, ?)";

// Preparar la sentencia
$stmt = mysqli_prepare($con, $consulta);

// Vincular parámetros
mysqli_stmt_bind_param($stmt, "sssi", $nombreCompleto, $correoElectronico, $telefono, $idProyecto);

// Ejecutar la sentencia
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
}

// Cerrar la sentencia y la conexión
mysqli_stmt_close($stmt);
mysqli_close($con);

