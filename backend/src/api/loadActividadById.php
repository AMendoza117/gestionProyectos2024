<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener el ID del proyecto desde la URL
$idActividad = mysqli_real_escape_string($con, $_GET['idActividad']);

// Consulta para obtener la información detallada del proyecto
$consultaActividadDetallada = "SELECT a.*, r.nombre AS nombreLiderProyecto
                              FROM Actividades a
                              LEFT JOIN LideresProyecto r ON a.idResponsable = r.idLiderProyecto
                              WHERE a.idActividad = $idActividad";

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
    );

    // Consulta para obtener los PDFs relacionados con la actividad
    $consultaPdfs = "SELECT rutaDocumento FROM DocumentosActividad WHERE idActividad = $idActividad";
    $resultadoPdfs = mysqli_query($con, $consultaPdfs);

    if ($resultadoPdfs) {
        $pdfs = array();
        while ($rowPdf = mysqli_fetch_assoc($resultadoPdfs)) {
            $pdfs[] = $rowPdf["rutaDocumento"];
        }
        $verActividad["pdfs"] = $pdfs;
    } else {
        $error_message = mysqli_error($con);
        echo json_encode(['error' => "Error al obtener los PDFs desde la base de datos: $error_message"]);
        exit;
    }

    // Consulta para obtener los Stakeholders relacionados con la actividad
    $consultaStakeholders = "SELECT * FROM Stakeholders WHERE idActividad = $idActividad";
    $resultadoStakeholders = mysqli_query($con, $consultaStakeholders);

    if ($resultadoStakeholders) {
        $stakeholders = array();
        while ($rowStakeholder = mysqli_fetch_assoc($resultadoStakeholders)) {
            $stakeholder = array(
                "id" => $rowStakeholder["idStakeholder"],
                "nombreCompleto" => $rowStakeholder["nombreCompleto"],
                "correoElectronico" => $rowStakeholder["correoElectronico"],
                "telefono" => $rowStakeholder["telefono"]
            );
            $stakeholders[] = $stakeholder;
        }
        $verActividad["stakeholders"] = $stakeholders;
    } else {
        $error_message = mysqli_error($con);
        echo json_encode(['error' => "Error al obtener los Stakeholders desde la base de datos: $error_message"]);
        exit;
    }

    // Imprimir resultado como JSON
    echo json_encode($verActividad);
} else {
    $error_message = mysqli_error($con);
    echo json_encode(['error' => "Error al obtener la actividad desde la base de datos: $error_message"]);
}

// Cerrar conexión a la base de datos
mysqli_close($con);
?>
