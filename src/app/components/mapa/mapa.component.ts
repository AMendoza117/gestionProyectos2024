import { Component, Inject, Input, OnInit } from '@angular/core';
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
  @Input() isOpen: boolean = false;
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
    document.addEventListener('DOMContentLoaded', function() {
      const showSiteMapButton = document.getElementById('showSiteMap');
      const siteMap = document.getElementById('siteMap');
    
      if (showSiteMapButton && siteMap) {
        showSiteMapButton.addEventListener('click', function() {
          siteMap.classList.toggle('hidden');
        });
      }
    });
  }

  closeModal() {
    this.isOpen = false;
  }

}


