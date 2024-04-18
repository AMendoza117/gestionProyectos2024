<?php
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener el nombre de usuario del localStorage (suponiendo que lo hayas guardado como 'username')
$username = $_GET['username'];

// Consulta preparada para obtener los datos del usuario según el nombre de usuario
$consulta = $con->prepare("SELECT nombre, apellidos, username FROM usuarios WHERE username = ?");
$consulta->bind_param("s", $username);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    $consulta->bind_result($nombre, $apellidos, $username);
    $consulta->fetch();

    // Preparar la respuesta con los datos del usuario
    $response = [
        'success' => true,
        'nombre' => $nombre,
        'apellidos' => $apellidos,
        'username' => $username
    ];
} else {
    // El usuario no fue encontrado en la base de datos
    $response = [
        'success' => false,
        'error' => 'Usuario no encontrado',
    ];
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión a la base de datos
$con->close();
?>
