import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { SignupComponent } from './examples/signup/signup.component';
import { LandingComponent } from './examples/landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrarProyectoComponent } from './components/registrar-proyecto/registrar-proyecto.component';
import { VerProyectoComponent } from './components/ver-proyecto/ver-proyecto.component';
import { AuthGuardService } from './services/auth.guard.service';
import { GetTokenComponent } from './components/recuperarContraseña/getToken/getToken.component';
import { ActualizarContraseñaComponent } from './components/recuperarContraseña/actualizarContraseña/actualizarContraseña.component';
import { Login2FAComponent } from './examples/login2FA/login2FA.component';
import { NotificationComponent } from './components/notification/notification.component';
import { RegistrarActividadComponent } from './components/registrar-actividad/registrar-actividad.component';
import { VerActividadComponent } from './components/ver-actividad/ver-actividad.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { EditarPerfilComponent } from './components/miPerfil/editar-perfil.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ComponentsComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'nucleoicons', component: NucleoiconsComponent },
  { path: 'ver-proyectop', component: NotificationComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  { path: 'registrar-proyecto', component: RegistrarProyectoComponent, canActivate: [AuthGuardService]},
  { path: 'ver-proyecto/:id', component: VerProyectoComponent, canActivate: [AuthGuardService]},
  { path: 'recuperar-contrasena', component: GetTokenComponent},
  { path: 'actualizar-contrasena', component: ActualizarContraseñaComponent},
  { path: 'login2FA', component: Login2FAComponent},
  { path: 'mapa', component: MapaComponent},
  { path: 'registrar-actividad/:id', component: RegistrarActividadComponent,  canActivate: [AuthGuardService]},
  { path: 'ver-actividad/:id', component: VerActividadComponent,  canActivate: [AuthGuardService]},
  { path: 'proyectos', component: ProyectosComponent,  canActivate: [AuthGuardService]},
  { path: 'gusuarios', component: RegistrarUsuarioComponent,  canActivate: [AuthGuardService]},
  { path: 'mi-perfil', component: EditarPerfilComponent,  canActivate: [AuthGuardService]}

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
