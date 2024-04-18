import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from './../../api.service';
import { Responsable } from 'app/Models/responsable.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/services/auth.service'; 

@Component({
  selector: 'app-registrar-actividad',
  templateUrl: './registrar-actividad.component.html',
  styleUrls: ['./registrar-actividad.component.css']
})
export class RegistrarActividadComponent implements OnInit {
  mostrarTabla = false;
  rol = null;
  idProyecto2: number;
  lastConsecutivo: string;
  actividadForm: FormGroup;
  responsables: Responsable[];
  documentoForm = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit() {
    const userRole = localStorage.getItem('userRole');

    // Verifica el rol del usuario para determinar si se muestra la tabla
    if (userRole === 'admin' || userRole === 'lider') {
      this.mostrarTabla = true;
    }

    this.idProyecto2 = +localStorage.getItem('idProyecto');
    this.actividadForm = this.fb.group({
      nombreActividad: ['', [Validators.required]],
      nombreCorto: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaTermino: ['', [Validators.required]],
      idResponsable: [null, [Validators.required]]
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
        if (this.actividadForm.valid) {
          const nombreCorto = this.actividadForm.value.nombreCorto;
          const folio = this.generateFolio(nombreCorto);
          console.log(this.idProyecto2);
          // Incluir el idProyecto en los datos de la actividad
          const actividadData = {
            folio,
            ...this.actividadForm.value,
            idProyecto2: this.idProyecto2, // Aquí incluimos el idProyecto obtenido del localStorage
            
          };
      
          this.apiService.registrarActividad(actividadData).subscribe(
            (response) => {
              if (response && response.success) {
                this.toastr.success('Actividad creada con éxito', 'Éxito');
                this.actividadForm.reset();  
                this.router.navigate(['/actividades']); // Redirigir a la lista de actividades después del registro exitoso
              } else {
                this.toastr.error('Error al registrar actividad', 'Error');
                console.error('Error al registrar actividad:', response.error);
              }
            },
            (error) => {
              console.error('Error en la solicitud para registrar actividad: ', error);
              this.toastr.error('Error en la solicitud para registrar actividad', 'Error');
            }
          );
        } else {
          console.log('Formulario de actividad no válido. No se puede registrar.');
          this.toastr.error('Formulario de actividad no válido. No se puede registrar', 'Error');
        }
      }


  redirectToHome() {
    this.router.navigate(['/dashboard']);
  }


}
