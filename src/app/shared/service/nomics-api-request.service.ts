import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { ExchangeRatesResponse } from '../interface/exchange-rates.model';

@Injectable()
export class NomicsApiRequestService {
    constructor(public http: HttpClient) {}

    public getExchangeRates(baseCurrency: string): Observable<ExchangeRatesResponse> {
        return this.http.get<ExchangeRatesResponse>(
            `${environment.exchangeRatesAPIUrl}/latest?base=${baseCurrency}`,
        );
    }
}
