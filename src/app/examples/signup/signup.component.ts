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

    username: string = '';
    password: string = '';
    constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private apiService: ApiService) { }

    ngOnInit() { }

    login() {
        this.apiService.login(this.username, this.password).subscribe((response) => {
            if (response.success) {
                this.toastr.info('Token enviado al correo electronico', 'Exito');
                this.router.navigate(['/login2FA']);
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
