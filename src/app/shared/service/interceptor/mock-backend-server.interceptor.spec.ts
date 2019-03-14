import { TestBed, inject, async } from '@angular/core/testing';

import { MockBackendServerInterceptor } from './mock-backend-server.interceptor';

describe('MockBackendServerInterceptorService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [MockBackendServerInterceptor],
        });
    }));

    it('should be created', inject([MockBackendServerInterceptor], (service: MockBackendServerInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
