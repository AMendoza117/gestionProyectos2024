import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { AuthService } from 'app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-actualizarContraseña-componente',
    templateUrl: './actualizarContraseña.component.html',
    styleUrls: ['./actualizarContraseña.component.css']
})
export class ActualizarContraseñaComponent {
    test: Date = new Date();
    focus;
    focus1;

    token: string = '';
    password: string = '';
    constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private apiService: ApiService) { }

    ngOnInit() { }

    login() {
        this.apiService.actualizarContraseña(this.token, this.password).subscribe((response) => {
            if (response.success) {
                this.router.navigate(['/signup']);
                this.toastr.success('Contraseña actualizada', 'Exito')
            } else {
                this.toastr.error('Token invalido', 'Error');
            }
        });
    }

}
