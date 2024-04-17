import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Responsable } from 'app/Models/responsable.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // No es necesario importar HttpClient aquí


@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  proyectoForm: FormGroup;
  documentoForm = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.proyectoForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(10)]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: [null, [Validators.required]],
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.documentoForm.patchValue({
        fileSource: file
      });
    }
  }


  onSubmit() {
    if (this.proyectoForm.valid) {
      const usuarioData = this.proyectoForm.value;

      this.http.post<any>('tu_script_php.php', usuarioData).subscribe(
        (response) => {
          if (response && response.success) {
            this.proyectoForm.reset();  
            window.location.reload();
          } else {
            console.error('Error al registrar proyecto.');
          }
        },
        (error) => {
          console.error('Error en la solicitud para registrar proyecto: ', error);
        }
      );
    }
  }

  redirectToHome() {
    this.router.navigate(['/dashboard']);
  }




}
