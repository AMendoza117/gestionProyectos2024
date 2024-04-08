<?php

use Firebase\JWT\ExpiredException;

require_once("./../lib/php-jwt/vendor/autoload.php");

include 'database.php';
use \Firebase\JWT\JWT;
/*
class AuthService
{

    private static ?object $loggedUser = null;
    public $SECRET_KEY = "xddd"; //key secret
    public $ACCESS_TOKEN_EXP_TIME = 20 * 60; // 3 minutes
    public $REFRESH_TOKEN_EXP_TIME = 60 * 60 * 24; // 1 day 
    private $MAX_LOGIN_ATTEMPTS = 3; // attemps max
    private $ACCESS_TOKEN_EMAIL_EXP_TIME = 15 * 60; // 15 minutes


    //==========================================================================================================
/*    public function loginWithToken($token, $con)
    {
        // Authenticate the user using the provided token
        $user = $this->getUserFromToken($token, $con);

        // Set the user as logged in
        $this->setLoggedUser($user);

        // Generate access and refresh tokens
        $access_token = $this->generateToken($user, $this->ACCESS_TOKEN_EXP_TIME, $this->SECRET_KEY);
        $refresh_token = $this->generateToken($user, $this->REFRESH_TOKEN_EXP_TIME, $this->SECRET_KEY);

        // Return the generated tokens
        return array(
            "access_token" => $access_token,
            "refresh_token" => $refresh_token,
        );
    }

*//*
    public function verifyUserAndSendToken($to, $con)
    {
        // Find the user by email
        $user = $this->findUserById($to, $con);

        // Check if the user exists
    /*    if (!$user) {
            throw new UserNotExistException("User incorrect");
        }


        $access_token_email = $this->generateToken($user, $this->ACCESS_TOKEN_EMAIL_EXP_TIME, $this->SECRET_KEY);

        //Prueba
        return array(
            "access_token_email" => $access_token_email,
        );

    }*/

    //=================================================================================================================================
  /*  public function login($email, $pass, $con)
    {
        $user = $this->findUserById($email, $con);
        if (!$user) {
            throw new UserNotExistException("User or password incorrect");
        }

        if ($user->is_lock == 1) {
            throw new LockedUserException("User locked");
        }

        $hasedPass = hash("sha256", $pass);
        if ($user->n_password != $hasedPass) {
            $attempt_count = $user->num_intentos + 1;
            $this->incrementUserLoginAttempts($email, $con);

            if ($attempt_count >= $this->MAX_LOGIN_ATTEMPTS) {
                $this->lockUser($email, $con);
                throw new IncorrectPasswordException("Password Incorrect", 0);
            }
            throw new IncorrectPasswordException("Password Incorrect", $this->MAX_LOGIN_ATTEMPTS - $attempt_count);
        }

        $this->setLoggedUser($user);

        if ($user->num_intentos > 0) {
            $this->resetUserLoginAttempts($email, $con);
        }

        $access_token = $this->generateToken($user, $this->ACCESS_TOKEN_EXP_TIME, $this->SECRET_KEY);
        $refresh_token = $this->generateToken($user, $this->REFRESH_TOKEN_EXP_TIME, $this->SECRET_KEY);

        return array(
            "access_token" => $access_token,
            "refresh_token" => $refresh_token,
        );
    }*/
/*
    public function authenticate($token, $con)
    {
        $user = $this->getUserFromToken($token, $con);
        if ($user) {
            $this->setLoggedUser($user);
        }
    }*/
/*
    public function refreshToken($token, $con)
    {
        $user = $this->getUserFromToken($token, $con);

        $access_token = $this->generateToken($user, $this->ACCESS_TOKEN_EXP_TIME, $this->SECRET_KEY);
        $refresh_token = $this->generateToken($user, $this->REFRESH_TOKEN_EXP_TIME, $this->SECRET_KEY);

        return array(
            "access_token" => $access_token,
            "refresh_token" => $refresh_token,
        );
    }*/

    /*
    private function getUserFromToken($token, $con)
    {
        try {
            $decoded = JWT::decode($token, $this->SECRET_KEY, array('HS256'));
            $userId = $decoded->data->id;
            $user = $this->findUserById($userId, $con);

            if (!$user) {
                throw new CorruptedTokenException("Token corrupted or invalid");
            }

            return $user;
        } catch (Exception $e) {
            if ($e instanceof ExpiredException) {
                throw new TokenExpiredException("Token expired");
            } else {
                throw new CorruptedTokenException("Token corrupted or invalid");
            }
        }
    }

    public function getLoggedUser()
    {
        return self::$loggedUser;
    }

    public function setLoggedUser($user)
    {
        self::$loggedUser = $user;
    }

    private function findIdByEmail($to, $con){
        $sequreId = mysqli_real_escape_string($con, trim($to));

        $query = "SELECT * FROM QSC_USUARIOS WHERE id_user ='$sequreId' LIMIT 1";
        $result = mysqli_query($con, $query);
        if ($result->num_rows == 0) {
            return null;
        }
        $user = $result->fetch_object();
        return $user;
    }

    private function findUserById($id, $con)
    {
        $sequreId = mysqli_real_escape_string($con, trim($id));
        $query = "SELECT * FROM usuarios WHERE id ='$sequreId' LIMIT 1";
        $result = mysqli_query($con, $query);
        if ($result->num_rows == 0) {
            return null;
        }
        $user = $result->fetch_object();
        return $user;
    }

    private function findUser($email, $pass, $con)
    {
        $hasedPass = hash("sha256", $pass);
        $sequreEmail = mysqli_real_escape_string($con, trim($email));
        $sql = "SELECT * FROM QSC_USUARIOS WHERE id_user ='$sequreEmail' AND n_password ='$hasedPass' AND is_lock = 0";

        $result = mysqli_query($con, $sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_object();
            return $row;
        } else {
            return null;
        }
    }

    public function generateToken($user, $exp_time, $SECRET_KEY)
    {
        $payload = array(
            "iss" => "https://localhost:8080/backend",
            "aud" => "https://localhost:8080/backend",
            "iat" => time(),
            "exp" => time() + $exp_time,
            "data" => array(
                "id" => $user->id_user,
                "name" => $user->n_name,
                "email" => $user->mail_user,
            ),
        );

        $jwt = JWT::encode($payload, $SECRET_KEY);
        return $jwt;
    }
}*/

class AuthService
{
    private static ?object $loggedUser = null;
    public $SECRET_KEY = "xddd"; //key secret
    public $ACCESS_TOKEN_EXP_TIME = 20 * 60; // 3 minutes
    public $REFRESH_TOKEN_EXP_TIME = 60 * 60 * 24; // 1 day 
    private $MAX_LOGIN_ATTEMPTS = 3; // attemps max
    private $ACCESS_TOKEN_EMAIL_EXP_TIME = 15 * 60; // 15 minutes


    private function findIdByEmail($to, $con){
        // Manejo de errores para mysqli_real_escape_string
        if (!$con) {
            // Manejo del error de conexión nula
            throw new Exception("Error: Conexión a la base de datos no establecida.");
        }

        $sequreId = mysqli_real_escape_string($con, trim($to));

        $query = "SELECT * FROM QSC_USUARIOS WHERE id_user ='$sequreId' LIMIT 1";

        // Manejo de errores para mysqli_query
        $result = mysqli_query($con, $query);
        if (!$result) {
            // Manejo del error de consulta fallida
            throw new Exception("Error de consulta: " . mysqli_error($con));
        }

        if ($result->num_rows == 0) {
            return null;
        }

        $user = $result->fetch_object();
        return $user;
    }

    public function verifyUserAndSendToken($to, $con)
    {
        // Find the user by email
        $user = $this->findUserById($to, $con);

        // Check if the user exists
    /*   if (!$user) {
            throw new UserNotExistException("User incorrect");
        }*/


        $access_token_email = $this->generateToken($user, $this->ACCESS_TOKEN_EMAIL_EXP_TIME, $this->SECRET_KEY);

        //Prueba
        return array(
            "access_token_email" => $access_token_email,
        );

    }
    private function findUserById($id, $con)
    {
        if (!$con) {
            // Manejo del error de conexión nula
            throw new Exception("Error: Conexión a la base de datos no establecida.");
        }

        $sequreId = mysqli_real_escape_string($con, trim($id));
        $query = "SELECT * FROM usuarios WHERE id ='$sequreId' LIMIT 1";

        $result = mysqli_query($con, $query);
        if (!$result) {
            // Manejo del error de consulta fallida
            throw new Exception("Error de consulta: " . mysqli_error($con));
        }

        if ($result->num_rows == 0) {
            return null;
        }

        $user = $result->fetch_object();
        return $user;
    }

    public function generateToken($user, $exp_time, $SECRET_KEY)
    {
        $payload = array(
            "iss" => "https://localhost:8080/backend",
            "aud" => "https://localhost:8080/backend",
            "iat" => time(),
            "exp" => time() + $exp_time,
            "data" => array(
                "id" => $user->id_user,
                "name" => $user->n_name,
                "email" => $user->mail_user,
            ),
        );

        $jwt = JWT::encode($payload, $SECRET_KEY);
        return $jwt;
    }
}
