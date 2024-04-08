<?php
// prueba 2
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once ("./../lib/PHPMailer/src/PHPMailer.php");
require_once ("./../lib/PHPMailer/src/Exception.php");
require_once ("./../lib/PHPMailer/src/SMTP.php");

require_once './authService.php';
require_once 'middlewares/allowCors.php';

function getJsonPostData()
{
  $data = json_decode(file_get_contents("php://input"));
  return $data;
}

$postData = getJsonPostData();

$email = $postData->email;
$password = $postData->password;
$to = $postData->correoElectronico; // Corrección de asignación de $to

function sendEmail($to, $token)
{
  try {
    $subject = "Nuevo Stakeholder Agregado";
    $message = "Hola ,\n\nHas sido agregado como Stakeholder al proyecto.";

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

    $verificationLinkWithToken = 'http://localhost:4200/' . "?token=" . $token;
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

 
    if ($verificationLinkWithToken != "") {
      $txt = '<tr>
                                        <td align=\'left\'>
                                          <table>
                                            <tr>
                                              <td align=\'left\' style=\'background-color: #2488DF; padding:15px 18px;-webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;\'>
                                                <div class="contentEditableContainer contentTextEditable">
                                                  <div class="contentEditable" align=\'center\'>
                                                    <a target=\'_blank\' href=\'' . $verificationLinkWithToken . '\' class=\'link2\' style=\'color:#ffffff;\'>Acceder</a>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td height=\'2\'> </td>
                                      </tr>
                                      
                                      <tr>
                                      <td align=\'left\'>
                                      <div class="contentEditableContainer contentTextEditable">
                                        <div class="contentEditable" align=\'left\'>
                                          <p style="color: #999;">
                                          El enlace tiene una caducidad de 15 minutos, al cumplirse el tiempo establecido usted deberá iniciar sesión nuevamente. 
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                      </tr>';
    }

    $txt .= '<tr>
        </html>';

    $mail->Body = $txt;

    // Attempt to send the email and handle errors.
    if ($mail->send()) {
      echo json_encode(array("message" => "Correo electrónico enviado con éxito."));
    } else {
      http_response_code(500);
      echo json_encode(array("error" => "Error al enviar el correo electrónico. $to"));
    }
    // Código para enviar el correo electrónico con PHPMailer
  } catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
  }
}

$authService = new AuthService();
// Authenticate the user and generate a token.
$login1 = $authService->verifyUserAndSendToken($email, $con);

//Send the authentication token via email
sendEmail($to, $login1["access_token_email"]); // Corrección del parámetro enviado a sendEmail
?>
