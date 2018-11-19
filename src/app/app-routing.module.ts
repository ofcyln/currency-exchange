import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { ConverterComponent } from './converter/converter.component';
import { HistoryComponent } from './history/history.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

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

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
