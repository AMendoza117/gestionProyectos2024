<?php
include 'database.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$username = $request->username;
$currentPassword = $request->currentPassword;
$newPassword = $request->newPassword;

// Obtener el hash SHA-256 de la contraseña actual
$hashedCurrentPassword = hash('sha256', $currentPassword);

// Verificar la contraseña actual
$consulta = $con->prepare("SELECT id, password FROM usuarios WHERE username = ?");
$consulta->bind_param("s", $username);
$consulta->execute();
$consulta->store_result();

if ($consulta->num_rows > 0) {
    $consulta->bind_result($id, $hashedPassword);
    $consulta->fetch();

    // Verificar si la contraseña actual coincide
    if ($hashedPassword === $hashedCurrentPassword) {
        // La contraseña actual es correcta, proceder a actualizarla
        $hashedNewPassword = hash('sha256', $newPassword);

        $updatePasswordQuery = $con->prepare("UPDATE usuarios SET password = ? WHERE username = ?");
        $updatePasswordQuery->bind_param("ss", $hashedNewPassword, $username);
        $updatePasswordQuery->execute();

        $response = ['success' => true];
    } else {
        // La contraseña actual no coincide
        $response = ['success' => false, 'error' => 'Contraseña actual incorrecta'];
    }
} else {
    // Usuario no encontrado
    $response = ['success' => false, 'error' => 'Usuario no encontrado'];
}

header('Content-Type: application/json');
echo json_encode($response);

$con->close();

