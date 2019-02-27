import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { LoginResponse } from '../../interface/user.model';

@Injectable()
export class MockBackendServerInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.endsWith('/login') && request.method === 'POST') {
            return (
                of(null)
                    .pipe(
                        mergeMap(() => {
                            const testUser = [
                                {
                                    username: 'user1',
                                    password: 'pass1',
                                    fullName: 'John Doe',
                                },
                                {
                                    username: 'user2',
                                    password: 'pass2',
                                    fullName: 'Adam Smith',
                                },
                            ];

                            request = request.clone();

                            if (
                                (request.body.username === testUser[0].username &&
                                    request.body.password === testUser[0].password) ||
                                (request.body.username === testUser[1].username &&
                                    request.body.password === testUser[1].password)
                            ) {
                                const body: LoginResponse = {
                                    token:
                                        'eyJhbGciOiJIUzI1NiIsInwefwefMSwiZ3VpZCI6IjQ0MDdmOTNjLWRjM' +
                                        'DEtNDQ2My1hMzhmwefwefLWUxZmJiMWQzMTRmOCIsImV4cCI6MTUxNzU3ODM2' +
                                        'NCwiZW1haWwiOiJuaWVrLmhlZXplbWFuc0Bmcm9udG1lbi5ubCIsImlhdCI6MTUx' +
                                        'NzUwefwef3Mjk2NH0.Ykirzr4b7GdsIPGV6PDjCpFHOAqohKazJl5pWJFw',
                                    user: {
                                        fullName:
                                            request.body.username === testUser[0].username ? 'John Doe' : 'Adam Smith',
                                        username: request.body.username === testUser[0].username ? 'user1' : 'user2',
                                    },
                                };

                                // if login details are valid return 200 OK with a hypothetical JWT
                                return of(
                                    new HttpResponse({
                                        status: 200,
                                        body,
                                    }),
                                );
                            } else {
                                // else return error
                                return throwError('Username or password is wrong!');
                            }
                        }),
                    )
                    // Called RxJS Materialize() and Dematerialize() methods
                    // to ensure delay which simulates server response
                    .pipe(
                        materialize(),
                        delay(1000),
                        dematerialize(),
                    )
            );
        }

        return next.handle(request);
    }
}
