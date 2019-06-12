import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

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

    constructor(public authService: AuthService, public element: ElementRef, public renderer: Renderer2) {}

    ngOnInit(): void {
        this.assignBannerShown();

        this.beforeInstallPromt();

        if (this.isChrome()) {
            StorageService.setItem('isBannerShown', 'true');

            this.assignBannerShown();
        }

        this.showIosBanner();
    }

    beforeInstallPromt() {
        this.renderer.listen('window', 'beforeinstallprompt', (event) => {
            event.preventDefault();

            this.deferredPrompt = event;

            this.addToHomeScreen();
        });
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
    }

    addToHomeScreen() {
        this.deferredPrompt.prompt();

        this.deferredPrompt.userChoice.then((choiceResult) => {
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
