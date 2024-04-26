import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidator } from 'app/services/password.validator';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  username: string | null = null;

  constructor(private apiService: ApiService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {
    // Obtener el nombre de usuario del localStorage
    this.username = localStorage.getItem('username');

    if (this.username) {
      // Inicializar el formulario
      this.perfilForm = this.fb.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        username: [{ value: this.username, disabled: true }], // Deshabilitar la edición del username
        password: ['', Validators.required],
        currentPassword: [''],
        newPassword: ['',[
          Validators.minLength(8),
          PasswordValidator.strong
        ]],
        confirmPassword: ['']
      });

      // Obtener los datos del perfil del usuario
      this.apiService.obtenerPerfil(this.username).subscribe(
        (perfilData: any) => {
          // Establecer los valores del formulario con los datos obtenidos
          this.perfilForm.patchValue({
            nombre: perfilData.nombre,
            apellidos: perfilData.apellidos,
          });
        },
        (error) => {
          console.error('Error al obtener los datos del perfil:', error);
          this.toastr.error('Error al obtener los datos del perfil', 'Error');
        }
      );
    } else {
      console.error('Nombre de usuario no encontrado en el localStorage');
      this.toastr.error('Nombre de usuario no encontrado', 'Error');
    }
  }

  onSubmit() {
    if (this.perfilForm.get('nombre')?.valid && this.perfilForm.get('apellidos')?.valid) {
        const perfilData = {
            username: this.username, // Incluir el username en la carga útil
            nombre: this.perfilForm.value.nombre,
            apellidos: this.perfilForm.value.apellidos
          };

      this.apiService.actualizarPerfil(perfilData).subscribe(
        (response) => {
          this.toastr.success('Perfil actualizado correctamente', 'Éxito');
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.toastr.error('Error al actualizar el perfil', 'Error');
        }
      );
    } else {
      this.toastr.error('Por favor completa todos los campos de nombre y apellido', 'Error');
    }
  }

  onUpdatePassword() {
    if (this.perfilForm.get('currentPassword')?.valid && this.perfilForm.get('newPassword')?.valid && this.perfilForm.get('confirmPassword')?.valid) {
      const passwordData = {
        username: this.username,
        currentPassword: this.perfilForm.get('currentPassword')?.value,
        newPassword: this.perfilForm.get('newPassword')?.value
      };

      this.apiService.actualizarContraseña2(passwordData).subscribe(
        (response) => {
          this.toastr.success('Contraseña actualizada correctamente', 'Éxito');
          this.perfilForm.get('currentPassword')?.reset(); // Limpiar los campos de contraseña después de la actualización
          this.perfilForm.get('newPassword')?.reset();
          this.perfilForm.get('confirmPassword')?.reset();
        },
        (error) => {
          console.error('Error al actualizar la contraseña:', error);
          this.toastr.error('Error al actualizar la contraseña', 'Error');
        }
      );
    } else {
      this.toastr.error('Por favor completa todos los campos de contraseña', 'Error');
    }
}

}
