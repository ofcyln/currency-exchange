import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { StorageService } from '../shared/service/storage.service';
import { LoginResponse } from '../shared/interface/user.model';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthService implements OnInit {
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {}

    login(username: string, password: string) {
        return this.http.post<LoginResponse>(`${environment.baseAPIUrl}/login`, { username, password }).pipe(
            tap((response: LoginResponse) => {
                if (response.token) {
                    StorageService.setItem('token', response.token);
                }
            }),
        );
    }

    removeToken() {
        StorageService.removeItem('token');
    }

    logout() {
        this.router.navigate(['login']);
    }

    isAuthenticated(): boolean {
        return StorageService.getItem('token') !== null;
    }
}
