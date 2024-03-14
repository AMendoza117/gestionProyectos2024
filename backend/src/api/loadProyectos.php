<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Consulta para obtener todos los proyectos
$consultaProyectos = "SELECT idProyecto, folio, nombreCorto, estadoProyecto FROM Proyectos";
$resultadoProyectos = mysqli_query($con, $consultaProyectos);

if ($resultadoProyectos) {
    $proyectos = array();

    while ($fila = mysqli_fetch_assoc($resultadoProyectos)) {
        $proyectos[] = $fila;
    }

    echo json_encode($proyectos);
} else {
    echo json_encode(['error' => 'Error al obtener proyectos desde la base de datos.']);
}

mysqli_close($con);
?>
