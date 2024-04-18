/*import { Injectable } from '@angular/core';
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
}*/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; 
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: number | null = null;
  private authToken: string | null = null;
  private tokenExpiration: Date | null = null;
  private readonly tokenValidityDurationMinutes: number = 30; // Duración de validez del token en minutos
  usuarioAutenticado: boolean = false;
  rolesUsuario: string[] = [];

  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {}

  login(token: string): Observable<any> {
    const credentials = { token };
    
    // Llama al método `login` de `apiService` para realizar la solicitud al backend
    return new Observable((observer) => {
      this.apiService.login2(token).subscribe(
        (response: any) => {
          if (response.success) {
            this.userRole = response.role; // Almacena el rol del usuario
            this.authToken = token; // Almacena el token del usuario
            this.tokenExpiration = new Date(new Date().getTime() + this.tokenValidityDurationMinutes * 60000); // Calcula la fecha de expiración del token
            localStorage.setItem('userRole', JSON.stringify(this.userRole)); // Guarda el rol en localStorage
            localStorage.setItem('authToken', this.authToken); // Guarda el token en localStorage
            localStorage.setItem('tokenExpiration', this.tokenExpiration.toISOString()); // Guarda la fecha de expiración en localStorage
            localStorage.setItem('username', response.username); 
            this.startTokenExpirationTimer(); // Inicia el temporizador de caducidad del token
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
    const authToken = localStorage.getItem('authToken');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    if (authToken && tokenExpiration) {
      this.authToken = authToken;
      this.tokenExpiration = new Date(tokenExpiration);
      
      // Verificar si el token ha caducado
      if (this.tokenExpiration > new Date()) {
        this.startTokenExpirationTimer(); // Inicia el temporizador de caducidad del token
        return true;
      } else {
        // Si ha caducado, realizar logout
        this.logout();
        return false;
      }
    }
    
    return false;
  }

  private startTokenExpirationTimer() {
    if (this.tokenExpiration) {
      const expirationMillis = this.tokenExpiration.getTime() - Date.now();
      setTimeout(() => {
        this.showSessionExpirationNotification(); // Llama a la función para mostrar la notificación cuando el token expire
      }, expirationMillis);
    }
  }
  
  /*private showSessionExpirationNotification() {
    // Muestra la notificación de expiración de sesión con un botón para renovar la sesión
    this.toastr.info('Tu sesión está a punto de expirar. ¿Deseas renovarla?', 'Sesión a punto de expirar', {
      closeButton: true,
      timeOut: 0, // No cerrar automáticamente
      extendedTimeOut: 0 // No cerrar automáticamente después de hacer clic en el botón
    }).onTap.subscribe(() => {
      // Si el usuario hace clic en la notificación, extiende la sesión y reinicia el temporizador del token
      this.renewSession();
    });
  }*/

  private showSessionExpirationNotification() {
    // Muestra la notificación de expiración de sesión con un botón para renovar la sesión
    const notification = this.toastr.info('Tu sesión está a punto de expirar. ¿Deseas renovarla?', 'Sesión a punto de expirar', {
      closeButton: true,
      timeOut: 60000, // Duración de la notificación: 1 minuto (60000 milisegundos)
      extendedTimeOut: 0 // No cerrar automáticamente después de hacer clic en el botón
    });
  
    // Crear un temporizador para cerrar la sesión si el usuario no interactúa con la notificación
    const logoutTimer = setTimeout(() => {
      this.logout();
    }, 60000); // Duración del temporizador: 1 minuto (60000 milisegundos)
  
    // Manejar el evento cuando el usuario hace clic en la notificación para renovar la sesión
    notification.onTap.subscribe(() => {
      // Si el usuario hace clic en la notificación, extender la sesión y reiniciar el temporizador del token
      this.renewSession();
      // Limpiar el temporizador de cierre de sesión
      clearTimeout(logoutTimer);
    });
  }
  
  
  private renewSession() {
    // Extiende la sesión actualizando la fecha de expiración del token y reiniciando el temporizador
    if (this.tokenExpiration) {
      const now = new Date();
      const newExpiration = new Date(now.getTime() + this.tokenValidityDurationMinutes * 60000);
      this.tokenExpiration = newExpiration;
      localStorage.setItem('tokenExpiration', this.tokenExpiration.toISOString());
      
      // Reinicia el temporizador de expiración del token
      this.startTokenExpirationTimer();
    }
  }

  isAdmin(): boolean {
    // Aquí implementa la lógica para determinar si el usuario es un administrador.
    // Por ejemplo, podrías comprobar si el rol del usuario es 'admin' o si tiene
    // algún otro atributo que indique que es un administrador.
    const userRole = localStorage.getItem('userRole');
    return userRole === 'admin';
  }
  

  getRedirectUrl() {
    // Implementa tu lógica para determinar la URL de redirección después de iniciar sesión
    return '/dashboard';
  }

  logout() {
    // Restablece todas las variables y elimina los datos del localStorage
    this.userRole = null;
    this.authToken = null;
    this.tokenExpiration = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('username');
    localStorage.setItem('isUserLoggedIn', 'false');  
    this.router.navigate(['/home']);  
    this.toastr.success('Se cerró la sesión correctamente', 'Adiós');
  }

}
