import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ConverterComponent } from './converter.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../../auth/auth.module';
import { CoreModule } from '../../core/core.module';
import { appRoutes, AppRoutingModule } from '../../app-routing.module';
import { HistoryComponent } from '../history/history.component';
import { CurrencyExchangeService } from '../../shared/service/currency-exchange.service';
import { ExchangeRatesApiRequestService } from '../../shared/service/exchange-rates-api-request.service';
import { StorageService } from '../../shared/service/storage.service';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

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
                RouterModule.forRoot(appRoutes),
            ],
            providers: [
                CurrencyExchangeService,
                ExchangeRatesApiRequestService,
                StorageService,
                {
                    provide: APP_BASE_HREF,
                    useValue: '/converter',
                },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ConverterComponent);

                compiled = fixture.componentInstance;

                dElement = fixture.debugElement.query(By.css('form'));
                hElement = dElement.nativeElement;
            });
    }));

    it('should have a header which says `I want to convert`', async(() => {
        hElement = fixture.debugElement.query(By.css('h1')).nativeElement;

        expect(hElement.innerText).toEqual('I want to convert');
    }));

    it('should not be able to click `CONVERT` button while it is disabled', async(() => {
        fixture.detectChanges();

        spyOn(compiled, 'exchangeRates');

        hElement = fixture.debugElement.query(By.css('button')).nativeElement;

        hElement.click();

        expect(compiled.exchangeRates).toHaveBeenCalledTimes(0);
    }));

    it('form should be invalid while input fields are empty', async(() => {
        fixture.detectChanges();

        compiled.converterForm.controls['amountControl'].setValue('');
        compiled.converterForm.controls['fromControl'].setValue('');
        compiled.converterForm.controls['toControl'].setValue('');

        expect(compiled.converterForm.valid).toBeFalsy();
    }));

    it('form should be valid while input fields are filled', async(() => {
        fixture.detectChanges();

        compiled.converterForm.controls['amountControl'].setValue(1);
        compiled.converterForm.controls['fromControl'].setValue('EUR');
        compiled.converterForm.controls['toControl'].setValue('TRY');

        expect(compiled.converterForm.valid).toBeTruthy();
    }));
});
