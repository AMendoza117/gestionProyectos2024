import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from './../../api.service';
import { Responsable } from 'app/Models/responsable.model';
@Component({
  selector: 'app-registrar-proyecto',
  templateUrl: './registrar-proyecto.component.html',
  styleUrls: ['./registrar-proyecto.component.css']
})
export class RegistrarProyectoComponent implements OnInit {
  lastConsecutivo: string;
  proyectoForm: FormGroup;
  responsables: Responsable[];
  documentoForm = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

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

    this.loadResponsables();
    this.getLastConsecutivo();
  }

  loadResponsables() {
    this.apiService.loadResponsables().subscribe(
      (responsables: Responsable[]) => {
        this.responsables = responsables;
      },
      (error) => {
        console.error('Error al cargar responsables:', error);
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

  getLastConsecutivo() {
    this.apiService.getLastConsecutivo().subscribe(
      (response: any) => {
        this.lastConsecutivo = response.lastConsecutivo;
      },
      (error) => {
        console.error('Error al obtener el último consecutivo:', error);
      }
    );
  }

  generateFolio(nombreCorto: string): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const nextNumber = this.lastConsecutivo + 1;
    const formattedNextNumber = nextNumber.toString().padStart(3, '0');
    return `${year}${month}-${nombreCorto}-${formattedNextNumber}`;
  }
  

  onSubmit() {
    if (this.proyectoForm.valid) {
      const nombreCorto = this.proyectoForm.value.nombreCorto;
      const folio = this.generateFolio(nombreCorto);

      const proyectoData = {
        folio,
        ...this.proyectoForm.value
      };


      this.apiService.registrarProyecto(proyectoData).subscribe(
        (response) => {
/*          if (response && response.success) {

            // Luego de registrar el proyecto, registrar el documento si hay uno adjunto
            const documento = this.documentoForm.get('fileSource').value;

            if (documento) {
              this.apiService.registrarDocumento(folio, documento).subscribe(
                (documentoResponse) => {
                  if (documentoResponse && documentoResponse.success) {
                    console.log('Documento registrado con éxito.');
                  } else {
                    console.error('Error al registrar documento.');
                  }
                },
                (documentoError) => {
                  console.error('Error en la solicitud para registrar documento: ', documentoError);
                }
              );
            }

            this.documentoForm.reset(); // Esto limpiará el formulario del documento
            this.proyectoForm.reset();  // Limpiar el formulario del proyecto
            window.location.reload();
          } else {
            console.error('Error al registrar proyecto.');
          }*/
        },
        (error) => {
          console.error('Error en la solicitud para registrar proyecto: ', error);
        }
      );
    } else {
      // Si el formulario de proyecto no es válido, registrar solo el proyecto sin adjuntar documento
      console.log('Formulario de proyecto no válido. Registrando solo el proyecto.');

      const nombreCorto = this.proyectoForm.value.nombreCorto;
      const folio = this.generateFolio(nombreCorto);

      const proyectoData = {
        folio,
        ...this.proyectoForm.value
      };

      this.apiService.registrarProyecto(proyectoData).subscribe(
        (response) => {
          if (response && response.success) {
            this.proyectoForm.reset();  
            window.location.reload();
          } else {
            console.error('Error al registrar proyecto.');
          }
        },
        (error) => {
          console.error('Error en la solicitud para registrar proyecto: ', error);
        }
      );
    }
  }



}
