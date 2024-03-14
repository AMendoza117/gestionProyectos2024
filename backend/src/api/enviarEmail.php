<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Permitir el origen dinámicamente
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Max-Age: 3600");
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once(__DIR__ . "/../lib/PHPMailer/src/PHPMailer.php");
require_once(__DIR__ . "/../lib/PHPMailer/src/Exception.php");
require_once(__DIR__ . "/../lib/PHPMailer/src/SMTP.php");

$postdata = file_get_contents("php://input");
header("Content-Type: application/json");

$request = json_decode($postdata);

// Asegúrate de obtener los datos necesarios del componente 'ver-proyecto'
$to = $request->correoElectronico;
$subject = "Nuevo Stakeholder Agregado";
$message = "Hola " . $request->nombreCompleto . ",\n\nHas sido agregado como Stakeholder al proyecto.";

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

try {
    $mail->send();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
