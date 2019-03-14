import { TestBed, inject, async } from '@angular/core/testing';

import { CurrencyExchangeService } from './currency-exchange.service';

describe('CurrencyExchangeService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [CurrencyExchangeService],
        });
    }));

    it('should be created', inject([CurrencyExchangeService], (service: CurrencyExchangeService) => {
        expect(service).toBeTruthy();
    }));
});
