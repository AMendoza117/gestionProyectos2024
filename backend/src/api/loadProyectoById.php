<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener el ID del proyecto desde la URL
$idProyecto = $_GET['idProyecto'];

// Consulta para obtener la información detallada del proyecto
$consultaProyectoDetallado = "SELECT p.*, r.nombre AS nombreLiderProyecto
                              FROM Proyectos p
                              LEFT JOIN LideresProyecto r ON p.idResponsable = r.idLiderProyecto
                              WHERE p.idProyecto = $idProyecto";

$resultadoProyectoDetallado = mysqli_query($con, $consultaProyectoDetallado);

if ($resultadoProyectoDetallado) {
    $row = mysqli_fetch_assoc($resultadoProyectoDetallado);

    // Obtener la información detallada del proyecto
    $verProyecto = array(
        "idProyecto" => $row["idProyecto"],
        "folio" => $row["folio"],
        "nombreProyecto" => $row["nombreProyecto"],
        "nombreCorto" => $row["nombreCorto"],
        "descripcion" => $row["descripcion"],
        "fechaInicio" => $row["fechaInicio"],
        "fechaTermino" => $row["fechaTermino"],
        "idResponsable" => $row["idResponsable"],
        "estadoProyecto" => $row["estadoProyecto"],
        "costo" => $row["costo"],
        "idLiderProyecto" => $row["idLiderProyecto"],
        "nombreLiderProyecto" => $row["nombreLiderProyecto"]
    );

    // Consulta para obtener los PDFs relacionados con el proyecto
    $consultaPdfs = "SELECT rutaDocumento FROM DocumentosProyecto WHERE folio = '" . $row["folio"] . "'";
    $resultadoPdfs = mysqli_query($con, $consultaPdfs);

    if ($resultadoPdfs) {
        $pdfs = array();
        while ($rowPdf = mysqli_fetch_assoc($resultadoPdfs)) {
            $pdfs[] = $rowPdf["rutaDocumento"];
        }
        $verProyecto["pdfs"] = $pdfs;
    } else {
        echo json_encode(['error' => 'Error al obtener los PDFs desde la base de datos.']);
        exit;
    }

    // Consulta para obtener los Stakeholders relacionados con el proyecto
    $consultaStakeholders = "SELECT * FROM Stakeholders
                             WHERE idProyecto = $idProyecto";
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
        $verProyecto["stakeholders"] = $stakeholders;
    } else {
        echo json_encode(['error' => 'Error al obtener los Stakeholders desde la base de datos.']);
        $response = [
            'success' => false,
            'error' => 'Error al insertar el usuario',
            'error_details' => mysqli_error($con)
        ];
        echo json_encode($response);
        exit;
    }

    $consultaPagosParciales = "SELECT * FROM PagosParciales p
                           WHERE p.idProyecto = $idProyecto";
    $resultadoPagosParciales = mysqli_query($con, $consultaPagosParciales);

    if ($resultadoPagosParciales) {
        $pagosParciales = array();
        while ($rowPagoParcial = mysqli_fetch_assoc($resultadoPagosParciales)) {
            $pagoParcial = array(
                "idPagoParcial" => $rowPagoParcial["idPagoParcial"],
                "idProyecto" => $rowPagoParcial["idProyecto"],
                "fechaPago" => $rowPagoParcial["fechaPago"],
                "monto" => $rowPagoParcial["monto"]
                // Agrega más campos según sea necesario
            );
            $pagosParciales[] = $pagoParcial;
        }
        $verProyecto["pagosParciales"] = $pagosParciales;
    } else {
        echo json_encode(['error' => 'Error al obtener los Pagos Parciales desde la base de datos.']);
        exit;
    }


    echo json_encode($verProyecto);
} else {
    echo json_encode(['error' => 'Error al obtener el proyecto desde la base de datos.']);
    $response = [
        'success' => false,
        'error' => 'Error al insertar el usuario',
        'error_details' => mysqli_error($con)
    ];
    echo json_encode($response);
}

mysqli_close($con);