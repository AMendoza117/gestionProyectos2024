import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'app/Models/Proyecto.model';
import { LiderConProyectos } from 'app/Models/liderConProyectos.model';
import { Lider } from 'app/Models/Lider.model';

import { ApiService } from 'app/api.service';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  proyectos: Proyecto[];
  lideresConProyectos: LiderConProyectos[];
  numProyectos: number;
  numProyectosActivos: number;
  numProyectosCompletados: number;
  nuevoLider: Lider = {
    idLiderProyecto: null,
    nombre: ''
  };
  
  showChat = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (!this.showChat) {
      console.log('Chat cerrado');
    }
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}


