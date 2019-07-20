import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, TranslateModule],
    providers: [AuthGuardService, AuthService],
    declarations: [LoginComponent],
})
export class AuthModule {}
