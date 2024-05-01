import { Input, Component } from '@angular/core';

@Component({
    selector: 'app-noti',
    templateUrl: './error403.component.html',
    styleUrls: ['./error403.component.css']
})

export class NotiComponent {
    @Input()
    public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;

    constructor() {
        this.alerts.push( {
            id: 3,
            type: 'info',
            message: 'Descubre nuestros precios haciendo clic aqui',
            icon: 'nc-bell-55'
        });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
    }

    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}

export interface IAlert {
    id: number;
    type: string;
    message: string;
    icon?: string;
}