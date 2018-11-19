import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { NomicsApiRequestService } from '../shared/service/nomics-api-request.service';
import { AlertService } from '../core/alert/alert.service';
import { CurrencyExchangeService } from '../shared/service/currency-exchange.service';
import { ExchangeRatesResponse } from '../shared/interface/exchange-rates.model';
import { map, startWith } from 'rxjs/operators';

export interface PeriodicHistoryElement {
    date: string;
    exchangeRate: number;
}

export interface Statistics {
    name: string;
    summary: number;
}

export enum FormNames {
    FromControl = 'fromControl',
    ToControl = 'toControl',
}

@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
    periodicHistoryData: PeriodicHistoryElement[] = [
        { date: '03/04/2018', exchangeRate: 1.13245342 },
        { date: '03/04/2018', exchangeRate: 1.13245342 },
        { date: '03/04/2018', exchangeRate: 1.13245342 },
        { date: '03/04/2018', exchangeRate: 1.13245342 },
        { date: '03/04/2018', exchangeRate: 1.13245342 },
    ];
    displayedHistoricalColumns: string[] = ['date', 'exchangeRate'];
    periodicHistorySource = this.periodicHistoryData;

    statisticalData: Statistics[] = [
        { name: 'Lowest', summary: 1.13245342 },
        { name: 'Highest', summary: 1.13245342 },
        { name: 'Average', summary: 1.13245342 },
    ];
    displayedStatisticalColumns: string[] = ['name', 'summary'];
    statisticalSource = this.statisticalData;

    selectedDuration = 'sevenDays';

    converterForm: FormGroup;
    filteredFromValues: Observable<string[]>;
    filteredToValues: Observable<string[]>;

    amount: number;
    fromRate: string;
    fromCurrency: string;
    toRate: string;
    toCurrency: string;
    result: string;

    constructor(
        public currencyExchangeService: CurrencyExchangeService,
        private apiRequestService: NomicsApiRequestService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
        this.converterForm = new FormGroup({
            amountControl: new FormControl('', [Validators.required]),
            fromControl: new FormControl('', [Validators.required]),
            toControl: new FormControl('', [Validators.required]),
        });

        this.converterForm.controls['fromControl'].disable();
        this.converterForm.controls['toControl'].disable();

        this.apiRequestService.getExchangeRates().subscribe(
            (exchangeRate: ExchangeRatesResponse[]) => {
                this.currencyExchangeService.exchangeRates = exchangeRate;

                this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

                this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

                this.converterForm.controls['fromControl'].enable();
                this.converterForm.controls['toControl'].enable();
            },
            (error) => {
                this.alertService.error(`Error: ${error}`);
            },
        );

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);
    }

    exchangeRates() {
        this.fromRate = this.filterSelectedValue(FormNames.FromControl).rate;
        this.fromCurrency = this.filterSelectedValue(FormNames.FromControl).currency;

        this.toRate = this.filterSelectedValue(FormNames.ToControl).rate;
        this.toCurrency = this.filterSelectedValue(FormNames.ToControl).currency;

        this.amount = Math.floor(this.converterForm.get('amountControl').value);

        this.result = (
            (this.converterForm.get('amountControl').value * +this.fromRate) /
            +this.toRate
        ).toFixed(3);
    }

    changeExchangeInputValues(): void {
        let fromValue = this.converterForm.get('fromControl').value;
        let toValue = this.converterForm.get('toControl').value;

        fromValue = this.converterForm.get('toControl').value;
        toValue = this.converterForm.get('fromControl').value;

        this.converterForm = new FormGroup({
            amountControl: new FormControl(this.converterForm.get('amountControl').value, [
                Validators.required,
            ]),
            fromControl: new FormControl(fromValue, [Validators.required]),
            toControl: new FormControl(toValue, [Validators.required]),
        });
    }

    filterSelectedValue(value: string) {
        return this.currencyExchangeService.exchangeRates.filter((item: ExchangeRatesResponse) => {
            return item.currency === this.converterForm.get(value).value;
        })[0];
    }

    mapItemCurrencies(): string[] {
        return this.currencyExchangeService.exchangeRates.map(
            (currencyItem: ExchangeRatesResponse) => {
                return currencyItem.currency;
            },
        );
    }

    getFromValueChanges(stringValue: string): Observable<string[]> {
        return this.converterForm.get(stringValue).valueChanges.pipe(
            startWith(''),
            map((value) => this.filterFromInputValue(value)),
        );
    }

    getToValueChanges(stringValue: string): Observable<string[]> {
        return this.converterForm.get(stringValue).valueChanges.pipe(
            startWith(''),
            map((value) => this.filterToInputValue(value)),
        );
    }

    private filterFromInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.fromCurrencies.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }

    private filterToInputValue(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.currencyExchangeService.toCurrencies.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }
}
