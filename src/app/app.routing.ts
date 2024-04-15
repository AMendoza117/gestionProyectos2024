import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ComponentsComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'nucleoicons', component: NucleoiconsComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'registrar-proyecto', component: RegistrarProyectoComponent, canActivate: [AuthGuardService]},
  { path: 'ver-proyecto/:id', component: VerProyectoComponent, canActivate: [AuthGuardService]},
  { path: 'recuperar-contrasena', component: GetTokenComponent},
  { path: 'actualizar-contrasena', component: ActualizarContraseñaComponent},
  { path: 'login2FA', component: Login2FAComponent}
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
