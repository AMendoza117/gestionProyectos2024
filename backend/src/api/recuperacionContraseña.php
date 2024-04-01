<?php
// prueba 2
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once (_DIR_ . "/../lib/PHPMailer/src/PHPMailer.php");
require_once (_DIR_ . "/../lib/PHPMailer/src/Exception.php");
require_once (_DIR_ . "/../lib/PHPMailer/src/SMTP.php");

require_once './authService.php';
require_once 'middlewares/allowCors.php';

function getJsonPostData()
{
  $data = json_decode(file_get_contents("php://input"));
  return $data;
}

$to = $request->correoElectronico;
function sendEmail($to, $token)
{
  try {
    $subject = "Nuevo Stakeholder Agregado";
    $message = "Hola ,\n\nHas sido agregado como Stakeholder al proyecto.";

    $remitente = 'arturolopez1997vecino@gmail.com';
    $nremitente = 'GestionProyectos';

    // Create an instance of PHPMailer.
    @$mail = new PHPMailer(true);

    // Configure the email sending parameters.
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->Username = 'arturolopez1997vecino@gmail.com';
    $mail->Password = 'jcivdngndtyspzrz';
    $mail->SMTPSecure = 'tls';

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

    $txt = '<html>
        <!-- ... (tu contenido HTML) ... -->
        </html>';

    $mail->Body = $message;

    // Attempt to send the email and handle errors.
    if ($mail->send()) {
      echo json_encode(array("message" => "Correo electrónico enviado con éxito."));
    } else {
      http_response_code(500);
      echo json_encode(array("error" => "Error al enviar el correo electrónico."));
    }
    // Código para enviar el correo electrónico con PHPMailer
  } catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
  }
}


$postData = getJsonPostData();
$email = $postData->email;
$password = $postData->password;

$authService = new AuthService();

try {
  // Authenticate the user and generate a token.
  $login1 = $authService->verifyUserAndSendToken($email, $con);

  //Send the authentication token via email
  sendEmail($email, $login1["access_token_email"]);

}