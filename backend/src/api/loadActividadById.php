<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener el ID del proyecto desde la URL
$idActividad = mysqli_real_escape_string($con, $_GET['idActividad']);

// Consulta para obtener la información detallada del proyecto
$consultaActividadDetallada = "SELECT *
                              FROM Actividades a
                              LEFT JOIN LideresProyecto r ON a.idResponsable = r.idLiderProyecto 
                              WHERE idActividad = $idActividad";

$resultadoActividadDetallada = mysqli_query($con, $consultaActividadDetallada);

if ($resultadoActividadDetallada) {
    $row = mysqli_fetch_assoc($resultadoActividadDetallada);

    // Obtener la información detallada de la actividad
    $verActividad = array(
        "idActividad" => $row["idActividad"],
        "folio" => $row["folio"],
        "nombreActividad" => $row["nombreActividad"],
        "nombreCorto" => $row["nombreCorto"],
        "descripcion" => $row["descripcion"],
        "fechaInicio" => $row["fechaInicio"],
        "fechaTermino" => $row["fechaTermino"],
        "idResponsable" => $row["idResponsable"],
        "estadoActividad" => $row["estadoActividad"],
        "idLiderProyecto" => $row["idLiderProyecto"],
        "nombre" => $row["nombre"],
    );  

    // Imprimir resultado como JSON
    echo json_encode($verActividad);
} else {
    $error_message = mysqli_error($con);
    echo json_encode(['error' => "Error al obtener la actividad desde la base de datos: $error_message"]);
}

// Cerrar conexión a la base de datos
mysqli_close($con);