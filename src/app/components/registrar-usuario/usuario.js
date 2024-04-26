// JavaScript para manejar la solicitud AJAX
document.getElementById("formulario_registro").addEventListener("submit", function(event){
    event.preventDefault(); // Evita que el formulario se envíe normalmente

    // Obtiene los datos del formulario
    var formData = new FormData(this);

    // Realiza la solicitud AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "addUser.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("Usuario registrado exitosamente");
                // Aquí puedes realizar cualquier otra acción que desees después de un registro exitoso
            } else {
                alert("Error: " + response.error + "\nDetalles: " + response.error_details);
            }
        }
    };
    xhr.send(JSON.stringify(Object.fromEntries(formData.entries())));
});