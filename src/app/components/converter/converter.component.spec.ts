import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterComponent } from './converter.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../../auth/auth.module';
import { CoreModule } from '../../core/core.module';
import { AppRoutingModule } from '../../app-routing.module';
import { HistoryComponent } from '../history/history.component';
import { CurrencyExchangeService } from '../../shared/service/currency-exchange.service';
import { ExchangeRatesApiRequestService } from '../../shared/service/exchange-rates-api-request.service';
import { StorageService } from '../../shared/service/storage.service';

describe('ConverterComponent', () => {
    let compiled: ConverterComponent;
    let fixture: ComponentFixture<ConverterComponent>;
    let dElement: DebugElement;
    let hElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConverterComponent, HistoryComponent],
            imports: [
                BrowserModule,
                HttpClientModule,
                LoadingBarHttpClientModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                AuthModule,
                CoreModule,
                AppRoutingModule,
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatTableModule,
                MatAutocompleteModule,
            ],
            providers: [CurrencyExchangeService, ExchangeRatesApiRequestService, StorageService],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ConverterComponent);

                compiled = fixture.componentInstance;

                dElement = fixture.debugElement.query(By.css('form'));
                hElement = dElement.nativeElement;
            });
    }));

    it('should have as text `I want to convert`', async(() => {
        expect(compiled.welcomeText).toEqual('I want to convert');
    }));

    it('should not be able to click `CONVERT` button while it is disabled', async(() => {
        fixture.detectChanges();

        spyOn(compiled, 'exchangeRates');

        hElement = fixture.debugElement.query(By.css('button')).nativeElement;

        hElement.click();

        expect(compiled.exchangeRates).toHaveBeenCalledTimes(0);
    }));
});
