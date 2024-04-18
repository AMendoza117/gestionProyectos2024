<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener datos de usuario y contraseña de la solicitud POST desde Angular
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$token = $request->token;

// Consulta preparada para verificar las credenciales del usuario
$consulta = $con->prepare("SELECT id, username, password, nombre, apellidos, role, token FROM usuarios WHERE token = ?");
$consulta->bind_param("s", $token);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    $consulta->bind_result($id, $username, $hashedPassword, $nombre, $apellidos, $role, $token);
    $consulta->fetch();

    // Comparar el token recibido con el token almacenado
    if ($token === $token) { // Comparación de tokens
        // Aquí va la lógica para enviar el correo electrónico
        
        // Generar un nuevo token único para el usuario
        $newToken = bin2hex(random_bytes(8));
        
        // Actualizar el token en la base de datos
        $updateTokenQuery = $con->prepare("UPDATE usuarios SET token = ? WHERE id = ?");
        $updateTokenQuery->bind_param("si", $newToken, $id);
        $updateTokenQuery->execute();

        // Preparar la respuesta
        $response = [
            'success' => true,
            'username' => $username,
            'role' => $role,
            'newToken' => $newToken // Devolver el nuevo token
        ];
    } else {
        // Los tokens no coinciden
        $response = [
            'success' => false,
            'error' => 'Token inválido',
        ];
    }
} else {
    // El token no se encontró en la base de datos
    $response = [
        'success' => false,
        'error' => 'Token no válido',
    ];
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión a la base de datos
$con->close();
