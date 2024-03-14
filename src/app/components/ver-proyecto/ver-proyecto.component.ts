// ver-proyecto.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerProyecto } from 'app/Models/VerProyecto.model';
import { Stakeholder } from 'app/Models/Stakeholder.model';
import { PagosParciales } from 'app/Models/PagosParciales.model';

@Component({
  selector: 'app-ver-proyecto',
  templateUrl: './ver-proyecto.component.html',
  styleUrls: ['./ver-proyecto.component.css']
})
export class VerProyectoComponent implements OnInit {
  verProyecto: VerProyecto;
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

  nuevoPagoParcial: PagosParciales = {
    idPagoParcial: null,
    fechaPago: '',
    monto: 0,
    idProyecto: null
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService) { 
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idProyecto = +params.get('id'); // Convierte el parámetro a número y asigna a this.idProyecto
      if (!isNaN(this.idProyecto)) {
        this.loadProyecto(this.idProyecto);
      }
    });
  }

  agregarPagoParcial() {
    const idProyecto = this.idProyecto;
    this.apiService.registrarPagosParciales(idProyecto, this.nuevoPagoParcial).subscribe(
      (response) => {
        if (response && response.success) {
          this.loadProyecto(this.idProyecto);
        } else {
          console.error('Error al agregar pago.');
        }
      },
      (error) => {
        console.error('Error en la solicitud para agregar pago: ', error);
      }
    )
  }

  agregarStakeholder() {
    // Obtener el ID del proyecto desde la ruta
    const idProyecto = this.idProyecto;
    // Agregar el nuevo stakeholder al proyecto
    this.apiService.agregarStakeholder(idProyecto, this.nuevoStakeholder).subscribe(
      (response) => {
        if (response && response.success) {
          // Enviar el correo electrónico después de agregar el stakeholder
          this.apiService.enviarCorreo(this.nuevoStakeholder).subscribe(
            (correoResponse) => {
              if (correoResponse && correoResponse.success) {
                console.log('Correo electrónico enviado con éxito.');
              } else {
                console.error('Error al enviar el correo electrónico.');
              }
            },
            (correoError) => {
              console.error('Error en la solicitud para enviar el correo electrónico: ', correoError);
            }
          );
          this.loadProyecto(this.idProyecto);
        } else {
          console.error('Error al agregar stakeholder.');
        }
      },
      (error) => {
        console.error('Error en la solicitud para agregar stakeholder: ', error);
      }
    );
  }

  loadProyecto(idProyecto: number) {
    this.apiService.getProyectoDetallado(idProyecto).subscribe(
      (verProyecto: VerProyecto) => {
        this.verProyecto = verProyecto;
      },
      (error) => {
        console.error('Error al cargar proyecto:', error);
      }
    );
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.documentoForm.patchValue({
        fileSource: file
      });
    }
  }

  terminado(idProyecto: number): void {
    this.apiService.terminado(idProyecto).subscribe(
      (response) => {
        this.loadProyecto(this.idProyecto);
      },
      (error) => {
        console.error('Error al actualizar el estado del proyecto', error);
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
