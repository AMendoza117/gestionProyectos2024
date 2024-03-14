<?php

//require 'conf.php';
//require 'protected.php';

//define("BASE_URL", "https://desarrollo2.buzondebuengobierno.es/");

//$server = BASE_URL;
//var_dump($server);

define("SERVER_SSO", $server);
//var_dump(SERVER_SSO);

function get_saml_settings_from_db($id_soc_conf) {
    $parameters = [];

    $con = connect();
    $sql = "SELECT * FROM QSC_PARAM_SSO WHERE ID_SOCIEDAD = '$id_soc_conf' ORDER BY id ASC";
    //var_dump($sql);die();
    if($result = mysqli_query($con, $sql))
    {
        while($row = mysqli_fetch_assoc($result))
        {
            $id_parametro = $row['id_parametro'];
            $parameters[$id_parametro] = $row['valor'];
        }
    } else {
        http_response_code(404);
        exit();
    }
    
    //var_dump($parameters);die();
    
    return $parameters;
}

function get_saml_settings($id_soc_conf, $parameters=null) {
    if ($parameters == null) {
        $parameters = get_saml_settings_from_db($id_soc_conf);
    }

    //var_dump($parameters);die();

    $saml_sp_nameid_format = 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified';
    if (isset($parameters['saml_sp_nameid_format'])) {
        $saml_sp_nameid_format = $parameters['saml_sp_nameid_format'];
    }

    //var_dump(SERVER_SSO);die();

    $settingsInfo = array(
        'debug' => $parameters['saml_debug'],
        'sp' => array(
            'entityId' => SERVER_SSO.'backend/api/saml_metadata.php',
            'assertionConsumerService' => array(
                'url' => SERVER_SSO.'backend/api/saml_acs.php',
            ),
            'singleLogoutService' => array(
                'url' => SERVER_SSO.'backend/api/saml_sls.php',
            ),
            'NameIDFormat' => $saml_sp_nameid_format,
        ),
        'idp' => array(
            'entityId' => $parameters['saml_idp_entity_id'],
            'singleSignOnService' => array(
                'url' => $parameters['saml_idp_sso_url'],
            ),
            'singleLogoutService' => array(
                'url' => $parameters['saml_idp_slo'],
            ),
            'x509certMulti' => [
                'signing' => [
                    0 => $parameters['saml_idp_cert'],
                ],
                'encryption' => [
                    0 => $parameters['saml_idp_cert'],
                ]
            ]
        ),
    );

    if (isset($parameters['saml_idp_cert2']) && !empty($parameters['saml_idp_cert2'])) {
        $settingsInfo['idp']['x509certMulti']['signing'][1] = $parameters['saml_idp_cert2'];
    }

    $exists_sp_pk = isset($parameters['saml_sp_pk']) && !empty($parameters['saml_sp_pk']);
    $exists_sp_cert = isset($parameters['saml_sp_cert']) && !empty($parameters['saml_sp_cert']);

    if ($exists_sp_pk && $exists_sp_cert) {
        $settingsInfo['sp']['x509cert'] = $parameters['saml_sp_cert'];
        $settingsInfo['sp']['privateKey'] = $parameters['saml_sp_pk'];
    }

    //var_dump($settingsInfo);die();

    return $settingsInfo;
}

function get_user_data($samlAttributes, $parameters) {
    $userAttributes = [];
    if (empty($samlAttributes)) {
        return $userAttributes;
    }

    $mailMapping = $parameters['saml_mapping_email'];
    $firstNameMapping = $parameters['saml_mapping_cn'];
    $lastNameMapping = $parameters['saml_mapping_sn'];
    $phoneMapping = $parameters['saml_mapping_phone'];
    $nationalIdMapping = $parameters['saml_mapping_national_id'];
    $mappings = [
        'mail' => $parameters['saml_mapping_email'],
        'first_name' => $parameters['saml_mapping_cn'],
        'last_name' => $parameters['saml_mapping_sn'],
        'phone' => $parameters['saml_mapping_phone'],
        'national_id' => $parameters['saml_mapping_national_id']
    ];

    foreach ($mappings as $name => $key) {
        if (isset($samlAttributes[$key])) {
            $userAttributes[$key] = $samlAttributes[$key][0];
        } else {
            $userAttributes[$key] = null;
        }
    }

    return $userAttributes;
}