<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once ("./../lib/PHPMailer/src/PHPMailer.php");
require_once ("./../lib/PHPMailer/src/Exception.php");
require_once ("./../lib/PHPMailer/src/SMTP.php");

//require_once './authService.php';
require_once 'middlewares/allowCors.php';

function getJsonPostData()
{
  $data = json_decode(file_get_contents("php://input"));
  return $data;
}

$postData = getJsonPostData();
include 'database.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$username = $request->username;

// Generar un token único
$token = bin2hex(random_bytes(8)); // Genera un token hexadecimal de 32 caracteres

// Verificar si el usuario existe en la base de datos
$consulta = "SELECT * FROM usuarios WHERE username = ?";
$stmt = mysqli_prepare($con, $consulta);
mysqli_stmt_bind_param($stmt, 's', $username);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);


if (mysqli_num_rows($resultado) == 1) {
  // El usuario existe, actualizar el token en la base de datos
  $consulta_update = "UPDATE usuarios SET token = ? WHERE username = ?";
  $stmt_update = mysqli_prepare($con, $consulta_update);
  mysqli_stmt_bind_param($stmt_update, 'ss', $token, $username);
  sendEmail($username, $token);
  if (mysqli_stmt_execute($stmt_update)) {
    // sendEmail($username, $token);  // No envíes el correo electrónico aquí
    //echo json_encode(['success' => true]);
  } else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
  }
} else {
  // El usuario no existe en la base de datos
  echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
}


function sendEmail($to, $token)
{
  try {
    $subject = "Recuperación de contraseña";
    $message = "Hola ,\n\nEste es el token para recuperar tu contraseña \n\n $token";

    // Cargar el contenido HTML de tu plantilla de correo electrónico
$html_message = file_get_contents("./../assets/template/recuperarConEmail.html");

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
  echo json_encode(['success' => true ]);
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

