import { Component } from '@angular/core';
import { ApiService } from 'app/api.service';
import { AuthService } from 'app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidator } from 'app/services/password.validator';

@Component({
  selector: 'app-actualizarContraseña-componente',
  templateUrl: './actualizarContraseña.component.html',
  styleUrls: ['./actualizarContraseña.component.css']
})
export class ActualizarContraseñaComponent {
  formulario: FormGroup;
  focus;
  focus1;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private apiService: ApiService) {
    this.formulario = this.formBuilder.group({
      token: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidator.strong
      ]]
    });
  }

  login() {
    if (this.formulario.valid) {
      this.apiService.actualizarContraseña(this.formulario.value.token, this.formulario.value.password).subscribe((response) => {
        if (response.success) {
          this.router.navigate(['/signup']);
          this.toastr.success('Contraseña actualizada', 'Éxito');
        } else {
          this.toastr.error('Token inválido', 'Error');
        }
      });
    }
  }
}
