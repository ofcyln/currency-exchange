import { Component, OnInit } from '@angular/core';

import { Alert, AlertService, AlertType } from './alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.scss'],
})
export class AlertComponent implements OnInit {
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }

            this.alerts.push(alert);
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter((item) => item !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            default:
                return 'alert alert-success';
        }
    }
}
