import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { ExchangeRatesApiRequestService } from '../shared/service/exchange-rates-api-request.service';
import { AlertService } from '../core/alert/alert.service';
import {
    CurrencyExchangeService,
    PeriodicHistoryElement,
} from '../shared/service/currency-exchange.service';
import {
    ExchangeRatesResponse,
    MappedCurrencyRateObject,
} from '../shared/interface/exchange-rates.model';
import { map, startWith } from 'rxjs/operators';
import { StorageService } from '../shared/service/storage.service';
import { MatTableDataSource } from '@angular/material';

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
    public periodicHistoryData: PeriodicHistoryElement[] = this.currencyExchangeService
        .periodicHistoryExchangeRates;

    public dataSource = new MatTableDataSource(this.periodicHistoryData);
    public displayedHistoricalColumns: string[] = ['date', 'exchangeRate'];

    public statisticalData: Statistics[];
    public statisticalDataSource = new MatTableDataSource(this.statisticalData);
    public displayedStatisticalColumns: string[] = ['name', 'summary'];

    public selectedDuration = 'allTime';

    public converterForm: FormGroup;
    public filteredFromValues: Observable<string[]>;
    public filteredToValues: Observable<string[]>;

    public id: number = new Date().getTime();
    public amount: number;
    public fromRate: number;
    public fromCurrency: string;
    public toRate: number;
    public toCurrency: string;
    public result: string;

    constructor(
        public currencyExchangeService: CurrencyExchangeService,
        private apiRequestService: ExchangeRatesApiRequestService,
        private alertService: AlertService,
        private storageService: StorageService,
    ) {}

    ngOnInit() {
        this.converterForm = this.currencyExchangeService.converterForm;

        this.converterForm.controls['fromControl'].disable();
        this.converterForm.controls['toControl'].disable();

        this.apiRequestService.getExchangeRates('USD').subscribe(
            (exchangeRate: ExchangeRatesResponse) => {
                this.currencyExchangeService.exchangeRates = this.mapResponseData(exchangeRate);

                this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

                this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

                this.converterForm.controls['fromControl'].enable();
                this.converterForm.controls['toControl'].enable();
            },
            (error) => {
                this.alertService.error(`Error: ${error.message}`);
            },
        );

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);

        this.statisticalData = [
            { name: 'Lowest', summary: this.getLowestRate() },
            { name: 'Highest', summary: this.getHighestRate() },
            { name: 'Average', summary: this.getAverageRate() > -1 ? this.getAverageRate() : 0 },
        ];

        this.statisticalDataSource = new MatTableDataSource(this.statisticalData);
    }

    exchangeRates(): void {
        this.fromRate = this.filterSelectedValue(FormNames.FromControl).rate;
        this.fromCurrency = this.filterSelectedValue(FormNames.FromControl).currency;

        this.toRate = this.filterSelectedValue(FormNames.ToControl).rate;
        this.toCurrency = this.filterSelectedValue(FormNames.ToControl).currency;

        this.amount = Math.floor(this.converterForm.get('amountControl').value);

        this.result = this.calculateExchangeRate();

        this.incrementNumberForID();

        this.currencyExchangeService.periodicHistoryExchangeRates.unshift({
            id: this.id,
            date: `${this.currencyExchangeService.getCurrentDate('/')}
\n@${this.currencyExchangeService.getCurrentTime(':')}`,
            time: this.currencyExchangeService.getCurrentTime(':'),
            exchangeRate: `${this.fromCurrency} to ${this.toCurrency}
\n${(+this.toRate / +this.fromRate).toFixed(5)}`,
            pureExchangeRate: Number((+this.toRate / +this.fromRate).toFixed(5)),
            creationDate: this.currencyExchangeService.getCurrentDate('/'),
            fromCurrency: this.fromCurrency,
            toCurrency: this.toCurrency,
            amount: this.amount,
        });

        this.storageService.setObject('exchangeRates', [
            ...this.currencyExchangeService.periodicHistoryExchangeRates,
        ]);

        this.dataSource = new MatTableDataSource(this.periodicHistoryData);
        this.statisticalData = [
            { name: 'Lowest', summary: this.getLowestRate() },
            { name: 'Highest', summary: this.getHighestRate() },
            { name: 'Average', summary: this.getAverageRate() > -1 ? this.getAverageRate() : 0 },
        ];

        this.statisticalDataSource = new MatTableDataSource(this.statisticalData);
    }

    changeExchangeInputValues(): void {
        this.converterForm = new FormGroup({
            amountControl: new FormControl(this.converterForm.get('amountControl').value, [
                Validators.required,
            ]),
            fromControl: new FormControl(this.converterForm.get('toControl').value, [
                Validators.required,
            ]),
            toControl: new FormControl(this.converterForm.get('fromControl').value, [
                Validators.required,
            ]),
        });

        this.incrementNumberForID();

        this.currencyExchangeService.fromCurrencies = this.mapItemCurrencies();

        this.currencyExchangeService.toCurrencies = this.mapItemCurrencies();

        this.filteredFromValues = this.getFromValueChanges(FormNames.FromControl);

        this.filteredToValues = this.getToValueChanges(FormNames.ToControl);
    }

    filterSelectedValue(value: string): MappedCurrencyRateObject {
        return this.currencyExchangeService.exchangeRates.filter(
            (item: MappedCurrencyRateObject) => {
                return item.currency === this.converterForm.get(value).value;
            },
        )[0];
    }

    mapItemCurrencies(): string[] {
        return this.currencyExchangeService.exchangeRates
            .map((currencyItem: MappedCurrencyRateObject) => {
                return currencyItem.currency;
            })
            .sort();
    }

    mapResponseData(responseData: ExchangeRatesResponse): MappedCurrencyRateObject[] {
        return Object.keys(responseData.rates).map(
            (item: string): MappedCurrencyRateObject => {
                return {
                    currency: item,
                    rate: responseData.rates[item],
                };
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

    getHighestRate(): number {
        return this.currencyExchangeService.periodicHistoryExchangeRates
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((first, second) => first - second)[
            this.currencyExchangeService.periodicHistoryExchangeRates.length - 1
        ];
    }

    getLowestRate(): number {
        return this.currencyExchangeService.periodicHistoryExchangeRates
            .map((item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            })
            .sort((first, second) => second - first)[
            this.currencyExchangeService.periodicHistoryExchangeRates.length - 1
        ];
    }

    getAverageRate(): number {
        let values = this.currencyExchangeService.periodicHistoryExchangeRates.map(
            (item: PeriodicHistoryElement) => {
                return Number(item.pureExchangeRate);
            },
        );
        let summary = values.reduce((acc, current) => current + acc, 0);

        return Number((summary / values.length).toFixed(5));
    }

    calculateExchangeRate(): string {
        return (
            (this.converterForm.get('amountControl').value * +this.toRate) /
            +this.fromRate
        ).toFixed(3);
    }

    incrementNumberForID(): number {
        return (this.id += 1);
    }

    filterTableUponDay(date: string, dayInterval: number): PeriodicHistoryElement[] {
        return this.currencyExchangeService.periodicHistoryExchangeRates.filter((item) => {
            return Math.abs(+item.creationDate.split('/')[0] - +date.split('/')[0]) <= dayInterval;
        });
    }

    filterTableUponMonth(
        date: string,
        dayInterval: number,
        monthInterval: number,
    ): PeriodicHistoryElement[] {
        return this.currencyExchangeService.periodicHistoryExchangeRates.filter((item) => {
            return (
                Math.abs(+item.creationDate.split('/')[0] - +date.split('/')[0]) <= dayInterval &&
                Math.abs(+item.creationDate.split('/')[1] - +date.split('/')[1]) <= monthInterval
            );
        });
    }

    selectedTimeInterval(): void {
        const date = this.currencyExchangeService.getCurrentDate('/');

        if (this.selectedDuration === 'sevenDays') {
            const sevenDaysData = this.filterTableUponDay(date, 6);

            this.dataSource = new MatTableDataSource(sevenDaysData);
        } else if (this.selectedDuration === 'fourteenDays') {
            const fourteenDaysData = this.filterTableUponMonth(date, 13, 0);

            this.dataSource = new MatTableDataSource(fourteenDaysData);
        } else if (this.selectedDuration === 'thirtyDays') {
            const thirtyDays = this.filterTableUponMonth(date, 30, 1);

            this.dataSource = new MatTableDataSource(thirtyDays);
        } else {
            this.dataSource = new MatTableDataSource(this.periodicHistoryData);
        }
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
