import { Input, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})

export class NotificationComponent {
    verProyecto: any; // Cambia el tipo según la estructura de tus datos de demostración
  idProyecto: number;
  
  constructor(private toastr: ToastrService) { 
    
  }

  ngOnInit(): void {
    // Simula la carga de datos de demostración
    this.verProyecto = {
      nombreProyecto: "Proyecto de demostración",
      folio: "PRO-001",
      descripcion: "Descripción del proyecto de demostración.",
      fechaInicio: "2024-01-01",
      fechaTermino: "2024-12-31",
      estadoProyecto: "En curso",
      costo: 100000,
      nombreLiderProyecto: "Líder de Proyecto de Demostración",
      pdfs: ["pdf1.pdf", "pdf2.pdf"], // Nombres de archivos PDF de demostración
      stakeholders: [ // Datos de stakeholders de demostración
        {
          nombreCompleto: "Stakeholder 1",
          correoElectronico: "stakeholder1@example.com",
          telefono: "123456789"
        },
        {
          nombreCompleto: "Stakeholder 2",
          correoElectronico: "stakeholder2@example.com",
          telefono: "987654321"
        }
      ],
      pagosParciales: [ // Datos de pagos parciales de demostración
        {
          monto: 5000,
          fechaPago: "2024-03-15"
        },
        {
          monto: 7000,
          fechaPago: "2024-06-30"
        }
      ]
    };
  }

  terminado(idProyecto: number): void {
    // Simula la acción de marcar el proyecto como terminado
    this.toastr.success('El proyecto se ha marcado como terminado.', 'Exito');
  }

  getPDFUrl(pdf: string): string {
    // Construye la URL completa al archivo PDF (simulación)
    return `http://localhost:8080/pdf/${pdf}`;
  }

  extractFileName(pdf: string): string {
    // Extrae el nombre del archivo de la ruta completa (simulación)
    const parts = pdf.split('/');
    return parts[parts.length - 1];
  }

}