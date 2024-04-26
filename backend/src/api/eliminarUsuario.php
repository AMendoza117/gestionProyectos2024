<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener los datos enviados desde la solicitud POST
$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $id = $data->id;

    // Consulta para eliminar el usuario por su ID
    $consultaEliminarUsuario = "DELETE FROM usuarios WHERE id = $id";
    $resultadoEliminarUsuario = mysqli_query($con, $consultaEliminarUsuario);

    if ($resultadoEliminarUsuario) {
        echo json_encode(['success' => 'Usuario eliminado correctamente.']);
    } else {
        echo json_encode(['error' => 'Error al eliminar usuario desde la base de datos.']);
    }
} else {
    echo json_encode(['error' => 'ID de usuario no proporcionado.']);
}

mysqli_close($con);
?>
