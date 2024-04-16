import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; 
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: number | null = null;
  private authToken: string | null = null;

  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {}

  login(token: string): Observable<any> {
    const credentials = { token };
    
    // Llama al método `login` de `apiService` para realizar la solicitud al backend
    return new Observable((observer) => {
      this.apiService.login2(token).subscribe(
        (response: any) => {
          if (response.success) {
            this.userRole = response.role; // Almacena el rol del usuario
            this.authToken = response.token; // Almacena el token del usuario
            localStorage.setItem('userRole', JSON.stringify(this.userRole)); // Guarda el rol en localStorage
            localStorage.setItem('authToken', this.authToken); // Guarda el token en localStorage
            this.router.navigate([this.getRedirectUrl()]);
          } else {
            // Manejar errores de inicio de sesión
            console.log('Error de inicio de sesión');
          }
          observer.next(response);
          observer.complete();
        },
        (error) => {
          console.error('Error en la solicitud de inicio de sesión', error);
          observer.error(error);
          observer.complete();
        }
      );
    });
  }


  isUserLoggedIn(): boolean {
    // Comprueba si el usuario ha iniciado sesión verificando si existe el token en localStorage
    return localStorage.getItem('authToken') !== null;
  }

  getRedirectUrl() {
    if (this.userRole === 1) {
      return '/dashboard';
    } else if (this.userRole === 2) {
      return '/dashboard';
    } else {
      return '/dashboard'; // Redirigir al inicio de sesión en caso de error o rol desconocido
    }
  }

  logout() {
    // Cerrar la sesión del usuario y redirigir al inicio de sesión
    this.userRole = null;
    this.authToken = null;
    localStorage.removeItem('userRole'); // Elimina el rol del localStorage
    localStorage.removeItem('authToken'); // Elimina el token del localStorage
    this.router.navigate(['/home']);
    this.toastr.success('Se cerro la sesión correctamente', 'Adios');
  }
}