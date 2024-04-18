<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Consulta para obtener todos los usuarios
$consultaUsuarios = "SELECT id, username, nombre, apellidos, role FROM usuarios";
$resultadoUsuarios = mysqli_query($con, $consultaUsuarios);

if ($resultadoUsuarios) {
    $usuarios = array();

    while ($fila = mysqli_fetch_assoc($resultadoUsuarios)) {
        $usuarios[] = $fila;
    }

    echo json_encode($usuarios);
} else {
    echo json_encode(['error' => 'Error al obtener usuarios desde la base de datos.']);
}

mysqli_close($con);
?>
