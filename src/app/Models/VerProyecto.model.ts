import { Stakeholder } from "./Stakeholder.model";
import { PagosParciales } from "./PagosParciales.model";

export interface VerProyecto {
    idProyecto: number;
    folio: string;
    nombreProyecto: string;
    nombreCorto: string;
    descripcion: string;
    fechaInicio: string;
    fechaTermino: string;
    idResponsable: number;
    estadoProyecto: string;
    costo: number;
    idLiderProyecto: number;
  
    // Nuevos campos
    nombreLiderProyecto?: string;
    pdfs?: string[]; // Rutas de los PDF
    stakeholders?: Stakeholder[];
    pagosParciales?: PagosParciales[];
  }
  