<?php
// Incluir la conexión a la base de datos
include 'database.php';

// Obtener los datos del cuerpo de la solicitud HTTP
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// Verificar si se recibieron los datos esperados
if (isset($request->username) && isset($request->nombre) && isset($request->apellidos)) {
    // Obtener los datos del objeto JSON
    $username = $request->username;
    $nombre = $request->nombre;
    $apellidos = $request->apellidos;

    // Preparar la consulta SQL para actualizar el perfil del usuario
    $consulta = $con->prepare("UPDATE usuarios SET nombre = ?, apellidos = ? WHERE username = ?");
    $consulta->bind_param("sss", $nombre, $apellidos, $username);

    // Ejecutar la consulta
    if ($consulta->execute()) {
        // Preparar la respuesta JSON
        $response = ['success' => true];
    } else {
        // Preparar la respuesta JSON en caso de error
        $response = ['success' => false, 'error' => 'Error al actualizar el perfil'];
    }
} else {
    // Preparar la respuesta JSON en caso de datos incompletos
    $response = ['success' => false, 'error' => 'Datos incompletos'];
}

// Establecer el encabezado de la respuesta HTTP como JSON
header('Content-Type: application/json');

// Enviar la respuesta JSON al cliente
echo json_encode($response);

// Cerrar la conexión a la base de datos
$con->close();
