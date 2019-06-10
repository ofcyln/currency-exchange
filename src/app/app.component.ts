import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { StorageService } from './shared/service/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public isBannerShown: string;
    public showBanner: boolean = true;

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
        this.isBannerShown = StorageService.getItem('isBannerShown');

        this.showIosBanner();
    }

    isIos() {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    }

    isInStandaloneMode() {
        return 'standalone' in (window as any).navigator && (window as any).navigator.standalone;
    }

    showIosBanner() {
        if (
            this.isIos() &&
            !this.isInStandaloneMode() &&
            (this.isBannerShown === null || this.isBannerShown === 'false')
        ) {
            StorageService.setItem('isBannerShown', 'true');
        }
    }

    close() {
        this.showBanner = !this.showBanner;
    }
}
