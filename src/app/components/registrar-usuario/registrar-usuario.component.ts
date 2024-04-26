import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'app/Models/usuario.model';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  proyectoForm: FormGroup;
  usuarios: Usuario[] = []; // Variable para almacenar la lista de usuarios
  mostrarTabla = true;

  constructor(private apiService: ApiService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {

    const userRole = localStorage.getItem('userRole');

    // Verifica el rol del usuario para determinar si se muestra la tabla
    if (userRole === 'admin' || userRole === 'lider') {
      this.mostrarTabla = true;
    }

    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      username: ['', [Validators.required]],
      role: [null, [Validators.required]],
    });

    // Obtener la lista de usuarios al inicializar el componente
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    // Llamar al servicio para obtener la lista de usuarios
    this.apiService.obtenerUsuarios().subscribe(
      (response: Usuario[]) => {
        this.usuarios = response;
      },
      (error) => {
        this.toastr.error('Error al obtener la lista de usuarios', 'Error');
      }
    );
  }

  eliminarUsuario(id: string) {
    // Llamar al servicio para eliminar el usuario
    this.apiService.eliminarUsuario(id).subscribe(
      (response) => {
        // Actualizar la lista de usuarios después de eliminar
        this.obtenerUsuarios();
        this.toastr.success('Usuario eliminado correctamente', 'Exito');
      },
      (error) => {
        this.toastr.error('Error al eliminar el usuario', 'Error');
      }
    );
  }

  onSubmit() {
    if (this.proyectoForm.valid) {
      const usuarioData = this.proyectoForm.value;
      this.apiService.registrarUsuario(usuarioData).subscribe(
        (response) => {
          this.toastr.success('Usuario registrado correctamente', 'Exito');
          this.proyectoForm.reset();
          // Actualizar la lista de usuarios después de registrar uno nuevo
          this.obtenerUsuarios();
        },
        (error) => {
          this.toastr.error('Error al registrar el usuario', 'Error');
        }
      )
    } else {
      this.toastr.error('Hay algo mal con tu solicitud', 'Error');
    }
  }
}
