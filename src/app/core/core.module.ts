import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from '../app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { LanguageButtonsComponent } from './language-buttons/language-buttons.component';

import { AlertModule } from './alert/alert.module';
import { MockBackendServerInterceptor } from '../shared/service/interceptor/mock-backend-server.interceptor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [HeaderComponent, NotFoundComponent, LanguageButtonsComponent],
    imports: [CommonModule, AlertModule, AppRoutingModule, MatButtonModule, TranslateModule],
    exports: [HeaderComponent, AlertModule, AppRoutingModule, LanguageButtonsComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockBackendServerInterceptor,
            multi: true,
        },
    ],
})
export class CoreModule {}
