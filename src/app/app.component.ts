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
    public deferredPrompt: any;

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
        this.assignBannerShown();

        if (this.isChrome()) {
            StorageService.setItem('isBannerShown', 'true');

            this.assignBannerShown();
        }

        this.showIosBanner();
    }

    assignBannerShown() {
        this.isBannerShown = StorageService.getItem('isBannerShown') || 'false';
    }

    isIos() {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    }

    isChrome() {
        return /google inc./.test(window.navigator.vendor.toLowerCase());
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

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();

            this.deferredPrompt = event;

            this.addToHomeScreen();
        });
    }

    addToHomeScreen() {
        this.deferredPrompt.prompt();

        this.deferredPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                StorageService.setItem('isBannerShown', 'true');
            }

            this.deferredPrompt = null;
        });
    }

    close() {
        this.showBanner = !this.showBanner;
    }
}
