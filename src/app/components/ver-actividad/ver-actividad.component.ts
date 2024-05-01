import { VerProyecto } from './../../Models/VerProyecto.model';
import { VerActividad } from './../../Models/VerActividad.model';
// ver-proyecto.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Stakeholder } from 'app/Models/Stakeholder.model';
import { Actividad } from 'app/Models/Actividad.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-actividad',
  templateUrl: './ver-actividad.component.html',
  styleUrls: ['./ver-actividad.component.css']
})
export class VerActividadComponent implements OnInit {
  mostrarTabla = false;
  verActividad: VerActividad;
  idActividad: number;
  idProyecto: number;
  documentoForm = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });
  nuevoStakeholder: Stakeholder = {
    id: null,
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
    idProyecto: null
  };

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { 
    
  }

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

    // Verifica el rol del usuario para determinar si se muestra la tabla
    if (userRole === 'admin' || userRole === 'lider') {
      this.mostrarTabla = true;
    }

    this.route.paramMap.subscribe((params) =>  {
      this.idActividad = +params.get('id'); // Convierte el parámetro a número y asigna a this.idProyecto
      if (!isNaN(this.idActividad)) {
        this.loadActividad(this.idActividad);
      }
    });
  }
  
  goBack(): void {
    window.history.back();
  }

  loadActividad(idActividad: number) {
    if(this.idActividad === this.idActividad){
    this.apiService.getActividadDetallada(idActividad).subscribe(
      (verActividad: VerActividad) => {
        this.verActividad = verActividad;
      },
      (error) => {
        console.error('Error al cargar Actividad:', error);
      }
    );
  }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.documentoForm.patchValue({
        fileSource: file
      });
    }
  }

  redirectToActividadDetalle(actividad: Actividad) {
    if (actividad && actividad.idActividad) {
      const url = ['ver-actividad', actividad.idActividad];
      this.router.navigate(url);
    } else {
      console.error('ID de proyecto indefinido. No se puede navegar.');
    }
  }

  Acterminada(idActividad: number): void {
    this.apiService.terminada(idActividad).subscribe(
      (response) => {
        this.loadActividad(this.idActividad);
      },
      (error) => {
        console.error('Error al actualizar el estado de la actividad', error);
        // Puedes manejar el error aquí si es necesario
      }
    );
  }
/*
  agregarDocumento() {
    const folio = this.verProyecto.folio;
    const documento = this.documentoForm.get('fileSource').value;

    this.apiService.registrarDocumento(folio, documento).subscribe(
      (documentoResponse) => {
        if (documentoResponse && documentoResponse.success) {
          this.documentoForm.reset(); // Esto limpiará el formulario del documento
          this.loadProyecto(this.idProyecto);
        } else {
          console.error('Error al registrar documento.');
        }
      },
      (documentoError) => {
        console.error('Error en la solicitud para registrar documento: ', documentoError);
      }
    );
  }
*/
  getPDFUrl(pdf: string): string {
    // Construye la URL completa al archivo PDF
    return `http://localhost:8080/pdf/${pdf}`;
  }

  extractFileName(pdf: string): string {
    // Extrae el nombre del archivo de la ruta completa
    const parts = pdf.split('/');
    return parts[parts.length - 1];
  }

}
