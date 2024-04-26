import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from './../../api.service';
import { Responsable } from 'app/Models/responsable.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/services/auth.service';
import { VerProyecto } from 'app/Models/VerProyecto.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-actividad',
  templateUrl: './registrar-actividad.component.html',
  styleUrls: ['./registrar-actividad.component.css']
})
export class RegistrarActividadComponent implements OnInit {
  mostrarTabla = true;
  verProyecto: VerProyecto;
  rol = null;
  idProyecto: number;
  lastConsecutivo: string;
  actividadForm: FormGroup;
  responsables: Responsable[];
  documentoForm = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit() {
    const userRole = localStorage.getItem('userRole');

    // Verifica el rol del usuario para determinar si se muestra la tabla
    if (userRole === 'admin' || userRole === 'lider') {
      this.mostrarTabla = true;
    }

    this.actividadForm = this.fb.group({
      nombreActividad: ['', [Validators.required]],
      nombreCorto: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaTermino: ['', [Validators.required]],
      idResponsable: [null, [Validators.required]],
      idProyecto: [this.idProyecto]
    });

    this.loadResponsables();
    this.getLastConsecutivo();

    this.route.paramMap.subscribe((params) => {
      this.idProyecto = +params.get('id'); // Convierte el parámetro a número y asigna a this.idProyecto
      if (!isNaN(this.idProyecto)) {
        this.loadProyecto(this.idProyecto);
      }
    });
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
          console.log(this.idProyecto);
          // Incluir el idProyecto en los datos de la actividad
          const actividadData = {
            folio,
            ...this.actividadForm.value,
            idProyecto: this.idProyecto, // Aquí incluimos el idProyecto obtenido del localStorage
            
          };
          this.apiService.registrarActividad(actividadData).subscribe(
            (response) => {
              if (response.success) {
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
              this.toastr.success('Actividad creada con éxito', 'Éxito');
              this.actividadForm.reset();  
              this.router.navigate(['/actividades']);
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
