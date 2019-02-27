import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.prod';
import { ExchangeRatesResponse } from '../interface/exchange-rates.model';

@Injectable()
export class ExchangeRatesApiRequestService {
    constructor(public http: HttpClient) {}

    public getExchangeRates(baseCurrency: string): Observable<ExchangeRatesResponse> {
        return this.http.get<ExchangeRatesResponse>(`${environment.exchangeRatesAPIUrl}/latest?base=${baseCurrency}`);
    }
}
