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

    constructor(public location: Location, private element: ElementRef, private authService: AuthService) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.username = localStorage.getItem('userRole');
        console.log(this.username);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
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
