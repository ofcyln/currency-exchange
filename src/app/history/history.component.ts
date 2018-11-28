import { Component, OnInit } from '@angular/core';
import {
    CurrencyExchangeService,
    PeriodicHistoryElement,
} from '../shared/service/currency-exchange.service';

export interface HistoryElement {
    date: string;
    event: string;
    actions: string;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
    periodicHistoryData: HistoryElement[] = this.customHistoryData() || [];
    displayedHistoricalColumns: string[] = ['date', 'event', 'actions'];
    periodicHistorySource = this.periodicHistoryData;

    constructor(private currencyExchangeService: CurrencyExchangeService) {}

    ngOnInit() {}

    customHistoryData() {
        return this.currencyExchangeService.periodicHistoryExchangeRates.map(
            (item: PeriodicHistoryElement): HistoryElement => {
                return {
                    date: item.date,
                    event: `Converted an amount of ${item.amount} from ${item.fromCurrency} to ${
                        item.toCurrency
                    }`,
                    actions: '',
                };
            },
        );
    }
}
