import { VerActividad } from './../../Models/VerActividad.model';
// ver-proyecto.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerProyecto } from 'app/Models/VerProyecto.model';
import { Stakeholder } from 'app/Models/Stakeholder.model';
import { PagosParciales } from 'app/Models/PagosParciales.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Proyecto } from 'app/Models/Proyecto.model';
import { Actividad } from 'app/Models/Actividad.model';

@Component({
  selector: 'app-ver-proyecto',
  templateUrl: './ver-proyecto.component.html',
  styleUrls: ['./ver-proyecto.component.css'],
  styles: [`
    ngb-progressbar {
    margin-top: 5rem;
}`]
})
export class VerProyectoComponent implements OnInit {
  actividades: Actividad[];
  actividad: Actividad;
  proyectos: Proyecto;
  verActividad: VerActividad;
  verProyecto: VerProyecto;
  idProyecto: number;
  idProyecto2: number;
  numActividades: number;
  numActividadesActivas: number;
  numActividadesCompletadas: number;

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

  constructor(private route: ActivatedRoute, private apiService: ApiService, private toastr: ToastrService, private router: Router) { 
    
  }

  ngOnInit(): void {    
    this.route.paramMap.subscribe((params) => {
      this.idProyecto = +params.get('id'); // Convierte el parámetro a número y asigna a this.idProyecto
      if (!isNaN(this.idProyecto)) {
        this.loadProyecto(this.idProyecto);
      }
    });
    this.loadActividades(this.idProyecto);

    console.log("Id proyecto jajjaja:", this.idProyecto);
  }

  agregarPagoParcial() {
    if (!this.nuevoPagoParcial.fechaPago || !this.nuevoPagoParcial.monto) {
      this.toastr.error('Por favor completa todos los campos', 'Error');
      return; // Detener la ejecución si algún campo está vacío
    }
    const idProyecto = this.idProyecto;
    this.apiService.registrarPagosParciales(idProyecto, this.nuevoPagoParcial).subscribe(
      (response) => {
        if (response && response.success) {
          this.loadProyecto(this.idProyecto);
          this.nuevoPagoParcial.fechaPago = '';
          this.nuevoPagoParcial.monto = 0;
          this.toastr.success('Pago agregado correctamente', 'Exito');
        } else {
          console.error('Error al agregar pago.');
          
          this.toastr.error('Error al agregar pago', 'Error');
        }
      },
      (error) => {
        console.error('Error en la solicitud para agregar pago: ', error);
      }
    )
  }

redirectToProyectoDetalle(proyecto: Proyecto) {
    if (proyecto && proyecto.idProyecto) {
      const url = ['registrar-actividad', proyecto.idProyecto];
      this.router.navigate(url);
    } else {
      console.error('ID de proyecto indefinido. No se puede navegar.');
    }
  }

  loadActividades(idProyecto: number) {
    this.apiService.loadActividades2(idProyecto).subscribe(
      (actividades: Actividad[]) => {
        this.actividades = actividades;
        console.log("Actividades: ",this.actividades)
        this.numActividades = actividades.length;
        this.numActividadesActivas = actividades.filter(p => p.estadoActividad === 'Activa').length;
        this.numActividadesCompletadas = actividades.filter(p => p.estadoActividad === 'Completada').length;
      },
      (error) => {
        console.error('Error al cargar actividades:', error);
      }
    );
  }

  loadActividad(idActividad: number) {
    this.apiService.getActividadDetallada(idActividad).subscribe(
      (verActividad: VerActividad) => {
        this.verActividad = verActividad;
      },
      (error) => {
        console.error('Error al cargar proyecto:', error);
      }
    );
  }


redirectToActividad(idActividad){ 
  if(!isNaN(idActividad)){
    const url = ['ver-actividad', idActividad];
      this.router.navigate(url);
      console.log(idActividad);
  }
}

  agregarStakeholder() {
    if (!this.nuevoStakeholder.nombreCompleto|| !this.nuevoStakeholder.correoElectronico) {
      this.toastr.error('Por favor completa todos los campos', 'Error');
      return; // Detener la ejecución si algún campo está vacío
    }
    // Obtener el ID del proyecto desde la ruta
    const idProyecto = this.idProyecto;
    // Agregar el nuevo stakeholder al proyecto
    this.apiService.agregarStakeholder(idProyecto, this.nuevoStakeholder).subscribe(
      (response) => {
        if (response && response.success) {
          // Enviar el correo electrónico después de agregar el stakeholder
          this.toastr.success('Stakeholder agregado correctamente', 'Exito');
          this.apiService.enviarCorreo(this.nuevoStakeholder).subscribe(
            (correoResponse) => {
              if (correoResponse && correoResponse.success) {
                this.toastr.success('Correo electronico enviado', 'Exito');
                console.log('Correo electrónico enviado con éxito.');
              } else {
                this.toastr.error('No se pudo enviar el correo electronico', 'Error');
                console.error('Error al enviar el correo electrónico.');
              }
            },
            (correoError) => {
              this.toastr.error('Error en la solicitud para enviar al correo electrónico', 'Error');
              console.error('Error en la solicitud para enviar el correo electrónico: ', correoError);
            }
          );
          this.loadProyecto(this.idProyecto);
          this.nuevoStakeholder.nombreCompleto = '';
          this.nuevoStakeholder.correoElectronico = '';
          this.nuevoStakeholder.telefono = '';
        } else {
          this.toastr.error('Error al agregar stakeholder', 'Error');
          console.error('Error al agregar stakeholder.');
        }
      },
      (error) => {
        this.toastr.error('Error en la solicitud para agregar stakeholder', 'Error');
        console.error('Error en la solicitud para agregar stakeholder: ', error);
      }
    );
  }

  calcularPorcentajeActividadesCompletadas(): number {
    return (this.numActividadesCompletadas / this.numActividades) * 100;
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

  redirectToRegistrarActividadDetalle() {
    if(!isNaN(this.idProyecto)){
      const url = ['registrar-actividad',this.idProyecto];
      this.router.navigate(url);
    }
  }

  obtenerColorFondo(actividad: Actividad): string {
    // Lógica para determinar el color en función del estado de la actividad
    switch (actividad.estadoActividad) {
      case 'En progreso':
        return '#e9ecef'; // Color gris por defecto
      case 'Completada':
        return '#28a745'; // Color verde cuando la actividad está completada
      case 'Cancelada':
        return '#dc3545'; // Color rojo cuando la actividad está cancelada
      default:
        return '#e9ecef'; // Color gris por defecto
    }
  }
  
  obtenerColorTexto(estadoActividad: string): string {
    // Determina el color del texto en función del estado de la actividad
    switch (estadoActividad) {
      case 'En progreso':
        return '#000'; // Color negro para el texto cuando la actividad está en progreso
      case 'Completada':
        return '#fff'; // Color blanco para el texto cuando la actividad está completada
      case 'Cancelada':
        return '#fff'; // Color blanco para el texto cuando la actividad está cancelada
      default:
        return '#000'; // Color negro por defecto
    }
  }
  

}
