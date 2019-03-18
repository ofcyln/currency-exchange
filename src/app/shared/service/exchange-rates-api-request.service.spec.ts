import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

import { ExchangeRatesApiRequestService } from './exchange-rates-api-request.service';
import { environment } from '../../../environments/environment.prod';

describe('ExchangeRatesAPIRequestService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const mockConfig = { BACKEND_URL: 'http:foo' };
    let exchangeRatesApiRequestService: ExchangeRatesApiRequestService;
    let APP_CONFIG = new InjectionToken<string>('app.config');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ExchangeRatesApiRequestService, { provide: APP_CONFIG, useValue: mockConfig }],
            imports: [HttpClientTestingModule],
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        exchangeRatesApiRequestService = TestBed.get(ExchangeRatesApiRequestService);
    }));

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));

    it('should create the service', inject(
        [ExchangeRatesApiRequestService],
        (service: ExchangeRatesApiRequestService) => {
            expect(service).toBeTruthy();
        },
    ));

    it('should make a HTTP call with GET request and get the response data', inject(
        [HttpTestingController, ExchangeRatesApiRequestService],
        (httpMock: HttpTestingController, service: ExchangeRatesApiRequestService) => {
            // We call the service
            service.getExchangeRates('USD').subscribe((data) => {
                expect(data.base).toBe('USD');
            });

            const req = httpMock.expectOne(`${environment.exchangeRatesAPIUrl}/latest?base=USD`);

            expect(req.request.method).toEqual('GET');

            req.flush({ base: 'USD' });
        },
    ));
});
