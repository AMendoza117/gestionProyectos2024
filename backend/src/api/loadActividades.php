<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Consulta para obtener todos las actividades
$consultaActividades = "SELECT idActividad, folio, nombreCorto, estadoActividad FROM Actividades";
$resultadoActividades = mysqli_query($con, $consultaActividades);

if ($resultadoActividades) {
    $actividades = array();

    // Obtener los resultados de la consulta
    while ($fila = mysqli_fetch_assoc($resultadoActividades)) {
        $actividades[] = $fila;
    }

    // Devolver los resultados como JSON
    echo json_encode($actividades);
} else {
    // Manejo de errores en caso de fallo en la consulta
    echo json_encode(['error' => 'Error al obtener actividades desde la base de datos.']);
}

// Cerrar conexión a la base de datos
mysqli_close($con);
?>
