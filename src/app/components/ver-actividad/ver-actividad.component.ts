import { VerActividad } from './../../Models/VerActividad.model';
// ver-proyecto.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerProyecto } from 'app/Models/VerProyecto.model';
import { Stakeholder } from 'app/Models/Stakeholder.model';
import { PagosParciales } from 'app/Models/PagosParciales.model';

@Component({
  selector: 'app-ver-actividad',
  templateUrl: './ver-actividad.component.html',
  styleUrls: ['./ver-actividad.component.css']
})
export class VerActividadComponent implements OnInit {
  mostrarTabla = true;
  verActividad: VerActividad;
  verProyecto: VerProyecto;
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

  constructor(private route: ActivatedRoute, private apiService: ApiService) { 
    
  }

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

    // Verifica el rol del usuario para determinar si se muestra la tabla
    if (userRole === 'admin' || userRole === 'lider') {
      this.mostrarTabla = true;
    }

    this.route.paramMap.subscribe((params) => {
      this.idProyecto = +params.get('id'); // Convierte el parámetro a número y asigna a this.idProyecto
      if (!isNaN(this.idProyecto)) {
        this.loadActividad(this.idProyecto);
      }
    });
  }    

  loadActividad(idActividad: number) {
    if(this.idProyecto === this.idProyecto){
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

  Acterminada(idActividad: number): void {
    this.apiService.terminado(idActividad).subscribe(
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
