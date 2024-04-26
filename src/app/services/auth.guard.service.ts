import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this.authService.isUserLoggedIn()) {
        // El usuario está autenticado, verificar el rol necesario para acceder a la ruta
        return true;
      } else {
        // El usuario no está autenticado, redirigir al inicio de sesión
        this.toastr.error('No estas autenticado', 'Error');
        this.router.navigate(['/signup']);
        return false;
      }
  }
}
