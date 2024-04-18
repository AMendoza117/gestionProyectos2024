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

// Datos del formulario de registro (debe pasarse en el cuerpo de la solicitud POST)
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$username = $request->username;
$nombre = $request->nombre;
$apellidos = $request->apellidos;
$role = $request->role;

// Generar una contraseña segura
$password = generarContrasena();

$to = $username;

$newToken = bin2hex(random_bytes(8));

$hashedPassword = hash('sha256', $password);

// Verificar si ya existe un usuario con el mismo username
$consulta_verificacion = "SELECT COUNT(*) AS num_usuarios FROM usuarios WHERE username = '$username'";
$resultado_verificacion = mysqli_query($con, $consulta_verificacion);
$fila_verificacion = mysqli_fetch_assoc($resultado_verificacion);

if ($fila_verificacion['num_usuarios'] > 0) {
    // Ya existe un usuario con el mismo username
    echo json_encode(['success' => false, 'error' => 'Ya existe un usuario con el mismo username']);
    exit; // Terminar la ejecución del script
}

// Insertar el nuevo proyecto en la base de datos
$consulta = "INSERT INTO usuarios (username, password, nombre, apellidos, role, token)
            VALUES ('$username', '$hashedPassword', '$nombre', '$apellidos', '$role', '$newToken')";


if (mysqli_query($con, $consulta)) {
    sendEmail($to, $username, $password);
} else {
  echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
}

// Función para generar una contraseña segura
function generarContrasena($longitud = 10) {
    $caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_';
    $longitud_caracteres = strlen($caracteres);
    $contrasena = '';
    for ($i = 0; $i < $longitud; $i++) {
        $contrasena .= $caracteres[rand(0, $longitud_caracteres - 1)];
    }
    return $contrasena;
}

function sendEmail($to, $username, $password)
{
  try {
    $subject = "Bienvenid@ a Gestor de Proyectos";

    // Cargar el contenido HTML de tu plantilla de correo electrónico
    $html_message = file_get_contents("./../assets/template/registrarUserEmail.html");

    // Reemplazar placeholders en la plantilla con datos dinámicos
    $html_message = str_replace("[username]", $username, $html_message);
    $html_message = str_replace("[password]", $password, $html_message);

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


