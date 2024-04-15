<?php
include 'database.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$token = $request->token;
$password = $request->password;

// Consulta para verificar si el token coincide en la tabla de usuarios
$consulta1 = "SELECT token FROM usuarios WHERE token = '$token'";
$resultado1 = mysqli_query($con, $consulta1);

if (!$resultado1) {
    echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
    exit; // Terminar la ejecución si hay un error en la consulta
}

$hashed_password = hash('sha256', $password);

// Verificar si se encontró un token correspondiente
if (mysqli_num_rows($resultado1) == 1) {
    // Actualizar el campo password en la tabla de usuarios
    $consulta2 = "UPDATE usuarios SET password = '$hashed_password' WHERE token = '$token'";
    if (mysqli_query($con, $consulta2)) {
        // Generar un nuevo token (o eliminar el token)
        $newToken = bin2hex(random_bytes(8));
        // Actualizar el campo token en la tabla de usuarios
        $consulta3 = "UPDATE usuarios SET token = '$newToken' WHERE token = '$token'";
        if (mysqli_query($con, $consulta3)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
    }
} else {
    // Si no se encuentra el token en la tabla de usuarios
    echo json_encode(['success' => false, 'error' => 'Token no válido']);
}

$con->close();
