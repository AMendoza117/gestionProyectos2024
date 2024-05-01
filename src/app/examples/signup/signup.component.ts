import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test: Date = new Date();
    focus;
    focus1;

    captchaResolved: boolean = false;
    captcha: string;  
    username: string = '';
    password: string = '';
    constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private apiService: ApiService) { 
        this.captcha = '';
    }

    ngOnInit() { }

    login() {
        //if (this.captchaResolved) {
            this.apiService.login(this.username, this.password).subscribe((response) => {
                if (response.success) {
                    this.toastr.info('Token enviado al correo electrónico', 'Éxito');
                    this.router.navigate(['/login2FA']);
                } else {
                    this.toastr.error('Datos incorrectos', 'Error');
                    console.log('Error de inicio de sesión');
                }
            });
       /* } else {
           this.toastr.error('Por favor, complete el captcha', 'Error');
        }*/
    }

    resolved(captchaResponse: string) {
        this.captcha = captchaResponse;
        this.captchaResolved = true;
        console.log('resolved captcha with response: ' + this.captcha);
    }

    rc() {
        // Navegar a la ruta del componente al que deseas dirigirte
        this.router.navigate(['/recuperar-contrasena']);
    }
}

