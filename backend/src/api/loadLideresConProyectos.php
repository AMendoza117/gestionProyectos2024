<?php

include 'database.php';

// Consulta SQL para obtener el nombre del líder y el número de proyectos
$query = "
SELECT LideresProyecto.nombre AS nombreLider, COUNT(Proyectos.idProyecto) AS numeroProyectos
FROM LideresProyecto
LEFT JOIN Proyectos ON LideresProyecto.idLiderProyecto = Proyectos.idResponsable
GROUP BY LideresProyecto.idLiderProyecto
";

$result = mysqli_query($con, $query);

if ($result) {
    $data = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    echo json_encode($data);
} else {
    echo json_encode(['error' => mysqli_error($con)]);
}

mysqli_close($con);

?>
