import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'app/Models/Proyecto.model';
import { LiderConProyectos } from 'app/Models/liderConProyectos.model';
import { Lider } from 'app/Models/Lider.model';

import { ApiService } from 'app/api.service';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[];
  lideresConProyectos: LiderConProyectos[];
  numProyectos: number;
  numProyectosActivos: number;
  numProyectosCompletados: number;
  nuevoLider: Lider = {
    idLiderProyecto: null,
    nombre: ''
  };

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.update();
  }
  

  // Implementar el método update para refrescar la información
  update(): void {
    this.loadProyectos();
    this.loadLideresConProyectos();
  }

  redirectToRegistrarProyecto() {
    this.router.navigate(['/registrar-proyecto']);
  }


  loadProyectos() {
    this.apiService.loadProyectos().subscribe(
      (proyectos: Proyecto[]) => {
        this.proyectos = proyectos;
        this.numProyectos = proyectos.length;
        this.numProyectosActivos = proyectos.filter(p => p.estadoProyecto === 'Activo').length;
        this.numProyectosCompletados = proyectos.filter(p => p.estadoProyecto === 'Completado').length;
      },
      (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    );
  }

  loadLideresConProyectos() {
    this.apiService.loadLideresConProyectos().subscribe(
      (lideres: LiderConProyectos[]) => {
        this.lideresConProyectos = lideres;
      },
      (error) => {
        console.error('Error al cargar líderes con proyectos:', error);
      }
    );
  }

  redirectToProyectoDetalle(proyecto: Proyecto) {
    if (proyecto && proyecto.idProyecto) {
      const url = ['ver-proyecto', proyecto.idProyecto];
      this.router.navigate(url);
    } else {
      console.error('ID de proyecto indefinido. No se puede navegar.');
    }
  }

  redirectToRegistrarActividad() {
    this.router.navigate(['/registrar-actividad']);
  }

  agregarLider() {
    this.apiService.registrarLider(this.nuevoLider).subscribe(
      (response) => {
        if (response && response.success) {
          this.loadLideresConProyectos();
        } else {
          console.error('Error al agregar lider.');
        }
      },
      (error) => {
        console.error('Error en la solicitud para agregar lider: ', error);
      }
    )
  }

  obtenerColorFondo(proyecto: Proyecto): string {
    // Lógica para determinar el color en función del estado de la actividad
    switch (proyecto.estadoProyecto) {
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
  
  obtenerColorTexto(estadoProyecto: string): string {
    // Determina el color del texto en función del estado de la actividad
    switch (estadoProyecto) {
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


