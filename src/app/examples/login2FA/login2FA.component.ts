import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login2FA',
    templateUrl: './login2FA.component.html',
    //styleUrls: ['./login2FA.component.scss']
})
export class Login2FAComponent implements OnInit {
    test: Date = new Date();
    focus;
    focus1;

    username: string = '';
    password: string = '';
    token: string = '';
    
    constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService) { }

    ngOnInit() { }

    login() {
        this.authService.login(this.token).subscribe((response) => {
            if (response.success) {
                this.router.navigate([this.authService.getRedirectUrl()]);
                this.toastr.success('Inicio de sesión correcto', 'Bienvenid@');
            } else {
                this.toastr.error('Datos incorrectos', 'Error');
                console.log('Error de inicio de sesión');
            }
        });
    }

    rc() {
        // Navegar a la ruta del componente al que deseas dirigirte
        this.router.navigate(['/recuperar-contrasena']);
    }
}


/*
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    constructor() { }

    ngOnInit() {}
}
*/
