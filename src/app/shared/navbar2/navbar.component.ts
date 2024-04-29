import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-navbar2',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent2 implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    username: string | null = null;
    query: string = '';
    indexedContent: any[] = [
        { keyword: 'inicio', url: '/#/dashboard' },
        { keyword: 'resumen de proyectos', url: '/#/dashboard' },
        { keyword: 'proyectos', url: '/#/dashboard' },
        { keyword: 'activos', url: '/#/dashboard' },
        { keyword: 'completados', url: '/#/dashboard' },
        { keyword: 'resumen de actividades', url: '/#/dashboard' },
        { keyword: 'actividades', url: '/#/dashboard' },
        { keyword: 'lideres', url: '/#/dashboard' },
        { keyword: 'líder', url: '/#/dashboard' },
        { keyword: 'número de proyectos', url: '/#/dashboard' },
        { keyword: 'agregar lider', url: '/#/dashboard' },
        { keyword: 'editar perfil', url: '/#/mi-perfil' },
        { keyword: 'nombre', url: '/#/mi-perfil' },
        { keyword: 'apellidos', url: '/#/mi-perfil' },
        { keyword: 'nombre de usuario', url: '/#/mi-perfil' },
        { keyword: 'guardar cambios', url: '/#/mi-perfil' },
        { keyword: 'contraseña actual', url: '/#/mi-perfil' },
        { keyword: 'nueva contraseña', url: '/#/mi-perfil' },
        { keyword: 'confirmar nueva contraseña', url: '/#/mi-perfil' },
        { keyword: 'actualizar contraseña', url: '/#/mi-perfil' },
        { keyword: 'proyectos', url: '/#/proyectos' },
        { keyword: 'crear', url: '/#/proyectos' },
        { keyword: 'registro de usuarios', url: '/#/gusuarios' },
        { keyword: 'nombre', url: '/#/gusuarios' },
        { keyword: 'apellido', url: '/#/gusuarios' },
        { keyword: 'correo electrónico', url: '/#/gusuarios' },
        { keyword: 'rol', url: '/#/gusuarios' },
        { keyword: 'registrar usuario', url: '/#/gusuarios' },
        { keyword: 'agregar usuario', url: '/#/gusuarios' },
        { keyword: 'acciones', url: '/#/gusuarios' },
    ];

    constructor(public location: Location, private element: ElementRef, private authService: AuthService) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.username = localStorage.getItem('userRole');
        console.log(this.username);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }

    search(): void {
        const keyword = this.query.toLowerCase().trim();
        const result = this.indexedContent.find(item => item.keyword === keyword);

        if (result) {
            window.location.href = result.url;
        } else {
            // Manejar el caso en que no se encuentra ninguna coincidencia
            console.log('No se encontraron resultados para la palabra clave:', keyword);
        }
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    };

    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    isLoggedIn(): boolean {
        return this.authService.isUserLoggedIn();
    }

    isAdmin(): boolean {
        return this.username === "admin"; // Ajusta según tus roles específicos
    }

    logout(): void {
        this.authService.logout();
    }
}
