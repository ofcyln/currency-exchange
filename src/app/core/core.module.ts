import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from '../app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { AlertModule } from './alert/alert.module';
import { MockBackendServerInterceptor } from '../shared/service/interceptor/mock-backend-server.interceptor';
import { MatButtonModule } from '@angular/material';

@NgModule({
    declarations: [
        HeaderComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        AlertModule,
        AppRoutingModule,
        MatButtonModule,
    ],
    exports: [
        HeaderComponent,
        AlertModule,
        AppRoutingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockBackendServerInterceptor,
            multi: true,
        },
    ],
})
export class CoreModule {}
