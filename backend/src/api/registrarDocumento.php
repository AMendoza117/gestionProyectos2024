<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Datos del formulario de registro (debe pasarse en el cuerpo de la solicitud POST)
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$folio = isset($_POST['folio']) ? $_POST['folio'] : $request->folio;
$documento = $_FILES['documento'];
$nombreOriginal = $documento['name'];

// Ruta relativa donde se guardará el documento con su nombre original
$rutaDocumento = "../pdf/" . $nombreOriginal;

// Guardar el documento en el servidor
if (move_uploaded_file($documento['tmp_name'], $rutaDocumento)) {
    // Insertar la información del documento en la base de datos
    $consultaDocumento = "INSERT INTO DocumentosProyecto (folio, rutaDocumento) VALUES ('$folio', '$rutaDocumento')";
    if (mysqli_query($con, $consultaDocumento)) {
        echo json_encode(['success' => true, 'rutaDocumento' => $rutaDocumento, 'folio' => $folio]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al registrar la información del documento en la base de datos.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar el documento.']);
}
?>
