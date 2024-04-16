import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {
  proyectoForm: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.proyectoForm = this.fb.group({
      nombreProyecto: ['', [Validators.required]],
      nombreCorto: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaTermino: ['', [Validators.required]],
      idResponsable: [null, [Validators.required]],
      costo: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.proyectoForm.valid) {
      this.toastr.success('Proyecto registrado correctamente (demostración)', 'Exito');
    } else {
      this.toastr.error('Error al registrar proyecto (demostración)', 'Error');
    }
  }

}
