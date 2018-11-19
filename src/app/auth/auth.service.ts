import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../shared/service/storage.service';
import { LoginResponse } from '../shared/interface/user.model';
import { environment } from '../../environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService implements OnInit {
    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private storageService: StorageService,
    ) {
    }

    ngOnInit() {
    }

    login(username: string, password: string) {
        return this.http
            .post<LoginResponse>(`${environment.baseAPIUrl}/login`, { username, password })
            .pipe(
                tap((response: LoginResponse) => {
                    if (response.token) {
                        this.storageService.setItem('token', response.token);
                    }
                }),
            );
    }

    removeToken() {
        this.storageService.removeItem('token');
    }

    logout() {
        this.router.navigate(['login']);
    }

    isAuthenticated(): boolean {
        return this.storageService.getItem('token') !== null;
    }

}
