import { Proyecto } from "./Proyecto.model";

export interface VerActividad {
    idActividad: number;
    nombreActividad: string;
    nombreCorto: string;
    descripcion: string;
    fechaInicio: string;
    fechaTermino: string;
    idResponsable: number;
    estadoActividad: string;
    idProyecto: number;
  }
  