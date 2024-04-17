<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once("./../lib/PHPMailer/src/PHPMailer.php");
require_once("./../lib/PHPMailer/src/Exception.php");
require_once("./../lib/PHPMailer/src/SMTP.php");

//require_once './authService.php';
require_once 'middlewares/allowCors.php';

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
    // Aqui va a ejecutar una funcion para que se envie un correo electronico, despues lo que se genera aqui abajo se pasara a otro php
    // Generar un token único para el usuario
    sendEmail($username, $token);
  } else {
    // La contraseña no coincide
    echo json_encode(['success' => false]);
  }
} else {
  // Las credenciales no son válidas, el inicio de sesión ha fallado
  echo json_encode(['success' => false]);
}

function sendEmail($to, $token)
{
  try {
    $subject = "Token para inicio de sesión";

    // Cargar el contenido HTML de tu plantilla de correo electrónico
    $html_message = file_get_contents("./../assets/template/dobleFactorEmail.html");

    // Reemplazar placeholders en la plantilla con datos dinámicos
    $html_message = str_replace("[token]", $token, $html_message);

    $remitente = 'arturolopez1997vecino@gmail.com';
    $nremitente = 'GestionProyectos';

    // Create an instance of PHPMailer.
    $mail = new PHPMailer(true); // Eliminación del @ antes de new

    // Configure the email sending parameters.
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->Username = 'arturolopez1997vecino@gmail.com';
    $mail->Password = 'jcivdngndtyspzrz';
    $mail->SMTPSecure = 'tls';
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    //$verificationLinkWithToken = 'http://localhost:4200/' . "?token=" . $token;
    // Nuevas configuraciones para CORS
    $mail->SMTPKeepAlive = true;
    $mail->Timeout = 30;
    $mail->SMTPOptions = [
      'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true,
      ],
    ];

    // Configuración del correo
    $mail->setFrom($remitente, $nremitente);
    $mail->addReplyTo($remitente, $nremitente);
    $mail->addAddress($to);
    $mail->isHTML(true);

    $mail->Subject = $subject;

    $mail->Body = $html_message;

    // Attempt to send the email and handle errors.
    if ($mail->send()) {
      echo json_encode(['success' => true]);
    } else {
      http_response_code(500);
      echo json_encode(array("error" => "Error al enviar el correo electrónico. $to"));
    }
    // Código para enviar el correo electrónico con PHPMailer
  } catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
  }
}
$con->close();
