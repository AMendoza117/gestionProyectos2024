import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-getToken-componente',
  templateUrl: './getToken.component.html',
  styleUrls: ['./getToken.component.css']
})
export class GetTokenComponent implements OnInit{
  test: Date = new Date();
  focus;
  focus1;

  username: string = '';
  password: string = '';
  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, private apiService: ApiService) { }

  ngOnInit() { }


  recuperarContrasena(){
    this.apiService.recuperarContrasena(this.username).subscribe((response) => {
      if(response.success){
        this.router.navigate(['/actualizar-contrasena']);
        this.toastr.success('Token enviado al correo electronico','Exito')
      } else {
        this.toastr.error('Cuenta no encontrada', 'Error');
      }
    })
  }
}
