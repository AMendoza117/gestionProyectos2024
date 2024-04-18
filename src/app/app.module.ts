import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importante: debes importar BrowserAnimationsModule
import { ToastrModule } from 'ngx-toastr'; // Importa ToastrModule
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrarProyectoComponent } from './components/registrar-proyecto/registrar-proyecto.component';
import { VerProyectoComponent } from './components/ver-proyecto/ver-proyecto.component';
import { RCComponent } from './components/rc/rc.component';
import { Error404Component } from './components/pantallaDeError/error404/error404.component';
import { Error403Component } from './components/pantallaDeError/error403/error403.component';
import { HttpClientModule } from '@angular/common/http';
import { ActualizarContraseñaComponent } from './components/recuperarContraseña/actualizarContraseña/actualizarContraseña.component';
import { GetTokenComponent } from './components/recuperarContraseña/getToken/getToken.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RegistrarActividadComponent } from './components/registrar-actividad/registrar-actividad.component';
import { VerActividadComponent } from './components/ver-actividad/ver-actividad.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { MapaComponent } from './components/mapa/mapa.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    RegistrarProyectoComponent,
    VerProyectoComponent,
    RCComponent,
    Error404Component,
    Error403Component,
    //ActualizarContraseñaComponent,
    //GetTokenComponent
    RegistrarActividadComponent,
    VerActividadComponent,
    RegistrarUsuarioComponent,
    ProyectosComponent,
    MapaComponent

  ],
  imports: [
    BrowserModule,
    //NgbModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    ExamplesModule,
    AppRoutingModule,
    BrowserAnimationsModule, // Asegúrate de importar BrowserAnimationsModule aquí
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
