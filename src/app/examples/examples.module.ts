import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importa los servicios necesarios
import { AuthService } from '../services/auth.service'; // Asegúrate de tener la ruta correcta
import { ToastrModule, ToastrService } from 'ngx-toastr'; // Asegúrate de tener la ruta correcta

import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'app/app.routing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
    ],
    declarations: [
        LandingComponent,
        SignupComponent,
    ],
    // Provee los servicios necesarios
    providers: [
        AuthService,
        ToastrService
    ]
})


export class ExamplesModule { }
