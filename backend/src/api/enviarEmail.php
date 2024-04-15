<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once(__DIR__ . "/../lib/PHPMailer/src/PHPMailer.php");
require_once(__DIR__ . "/../lib/PHPMailer/src/Exception.php");
require_once(__DIR__ . "/../lib/PHPMailer/src/SMTP.php");

// Permitir solicitudes desde http://localhost:4200
header("Access-Control-Allow-Origin: http://localhost:4200");

// Permitir el envío de cookies y otras credenciales en la solicitud
header("Access-Control-Allow-Credentials: true");

// Permitir métodos específicos (GET, POST, etc.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Permitir ciertos encabezados en las solicitudes
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$postdata = file_get_contents("php://input");
header("Content-Type: application/json");

$request = json_decode($postdata);

// Asegúrate de obtener los datos necesarios del componente 'ver-proyecto'

$to = $request->correoElectronico;
$nombreCompleto = $request->nombreCompleto;

try {
    $subject = "Nuevo Stakeholder Agregado";

    // Cargar el contenido HTML de tu plantilla de correo electrónico
    $html_message = file_get_contents("./../assets/template/stakeholderEmail.html");

    // Reemplazar placeholders en la plantilla con datos dinámicos
    $html_message = str_replace("[Name]", $nombreCompleto, $html_message);

    $remitente = 'arturolopez1997vecino@gmail.com';
    $nremitente = 'GestionProyectos';

    $mail = new PHPMailer(true);

    // Configuración del servidor de correo
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->Username = 'arturolopez1997vecino@gmail.com';
    $mail->Password = 'jcivdngndtyspzrz';
    $mail->SMTPSecure = 'tls';
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

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

    $txt = "";

    $mail->Body = $html_message;

    // Intenta enviar el correo electrónico y manejar los errores.
    if ($mail->send()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(array("error" => "Error al enviar el correo electrónico. $to"));
    }
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
