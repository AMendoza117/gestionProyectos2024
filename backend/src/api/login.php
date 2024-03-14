<?php
/*// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener datos de usuario y contraseña de la solicitud POST desde Angular
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$usuario = $request->username;
$contrasena = $request->password;

// Consulta preparada para verificar las credenciales del usuario
$consulta = $con->prepare("SELECT * FROM usuarios WHERE username = ?");
$consulta->bind_param("s", $usuario);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    $consulta->bind_result($id, $username, $password, $nombre, $apellidos, $role);
    $consulta->fetch();

    if ($contrasena == $password) {
        // Las credenciales son válidas, el usuario ha iniciado sesión con éxito
        $response = [
            'success' => true,
            'role' => $role,
        ];
    } else {
        // La contraseña no coincide
        $response = [
            'success' => false,
            'error' => 'Contraseña incorrecta',
        ];
    }
} else {
    // Las credenciales no son válidas, el inicio de sesión ha fallado
    $response = [
        'success' => false,
        'error' => 'Usuario no encontrado',
    ];
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

$con->close();
?>*/
// Incluir el archivo de conexión a la base de datos
include 'database.php';

// Obtener datos de usuario y contraseña de la solicitud POST desde Angular
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$usuario = $request->username;
$contrasena = $request->password;

// Consulta preparada para verificar las credenciales del usuario
$consulta = $con->prepare("SELECT * FROM usuarios WHERE username = ?");
$consulta->bind_param("s", $usuario);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    $consulta->bind_result($id, $username, $password, $nombre, $apellidos, $role, $token);
    $consulta->fetch();

    // Hash SHA-256 de la contraseña proporcionada en la solicitud
    $hashedPassword = hash('sha256', $contrasena);

    if ($hashedPassword == $password) {
        // Las credenciales son válidas, el usuario ha iniciado sesión con éxito
        $response = [
            'success' => true,
            'role' => $role,
        ];
    } else {
        // La contraseña no coincide
        $response = [
            'success' => false,
            'error' => 'Contraseña incorrecta',
        ];
    }
} else {
    // Las credenciales no son válidas, el inicio de sesión ha fallado
    $response = [
        'success' => false,
        'error' => 'Usuario no encontrado',
    ];
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

$con->close();
?>
