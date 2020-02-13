import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { AlertService } from '../../core/alert/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;

    public loading: boolean = false;
    public returnUrl: string;
    public animationActive: boolean;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthService,
        private alertService: AlertService,
    ) {
        this.authenticationService.removeToken();
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/converter';

        this.loginForm = new FormGroup({
            username: new FormControl('user1', [Validators.required]),
            password: new FormControl('pass1', [Validators.required]),
        });
    }

    onSubmit() {
        this.loading = true;
        this.animationActive = !this.animationActive;

        this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
            () => {
                this.router.navigate([this.returnUrl]);
            },
            (err: string) => {
                this.alertService.error(err);

                this.loading = false;
                this.animationActive = false;
            },
        );
    }
}
