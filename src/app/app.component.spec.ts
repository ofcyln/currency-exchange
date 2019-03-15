import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule, Routes } from '@angular/router';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppModule } from './app.module';
import { LoginComponent } from './auth/login/login.component';
import { ConverterComponent } from './components/converter/converter.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { HistoryComponent } from './components/history/history.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    const appRoutes: Routes = [
        {
            path: '',
            redirectTo: '/converter',
            pathMatch: 'full',
        },
        { path: 'login', component: LoginComponent },
        { path: 'converter', component: ConverterComponent, canActivate: [AuthGuardService] },
        { path: 'history', component: HistoryComponent, canActivate: [AuthGuardService] },
        { path: 'not-found', component: NotFoundComponent },
        { path: '**', redirectTo: 'not-found' },
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                AppModule,
                CoreModule,
                LoadingBarHttpClientModule,
                RouterModule.forRoot(appRoutes),
            ],
            providers: [
                {
                    provide: APP_BASE_HREF,
                    useValue: '/',
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should check the `main` content has the class more than 2', async(() => {
        const testbed = TestBed.createComponent(AppComponent);
        testbed.detectChanges();
        const compiled = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('main').classList.length).toBeGreaterThan(2);
    }));
});
