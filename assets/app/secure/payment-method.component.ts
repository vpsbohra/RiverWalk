import { Component, OnInit }                                    from '@angular/core';
import { Router }                                               from '@angular/router';
import { Http, Response, Headers }                              from '@angular/http';
import { Auth }                                                 from './../services/auth.service';
import { Payment }    			                                from '../models/payment';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import {FormGroup, Validators, FormControl }                    from "@angular/forms";
import {INVALID, VALID} from "@angular/forms/src/model";

@Component({
    providers: [ Auth ],
    templateUrl: './payment-method.component.html'
})
export class PaymentMethodComponent implements OnInit {
    creditCardForm: FormGroup;
FirstFun="";
    constructor( private router: Router, private auth: Auth,  private http: Http, private toastyService: ToastyService, private toastyConfig: ToastyConfig  ) { 
                     
           if(localStorage.getItem("profileredirect")) {
                     this.router.navigate(['./payment-method']);
                 }
            else
            {
              this.router.navigate(['./profile']);
            }
            localStorage.removeItem("profileredirect");
    }

    // Credit Card Form
    payment = new Payment(this.auth.user.id, this.auth.user.email, '', '', '', '', '', '', '', '', '', '', '', this.auth.user.customer_profile_id);
    paymentActive = true;
    cardTypes = ['American Express', 'Discover', 'Master Card', 'Visa'];
    expMonths = ['January','February','March','April','May','June','July','August','September', 'October','November','December'];
    expYears = ['2016','2017', '2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036','2037','2038','2039', '2040','2041','2042','2043','2044','2045','2046','2047','2048','2049','2050','2051'];
    states = ['Select State', 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    ngOnInit() {
        console.log(this.payment);
        this.creditCardForm = new FormGroup({
            id : new FormControl(this.auth.user.id,Validators.required ),
            email : new FormControl(this.auth.user.email,Validators.required ),
          
            firstName: new FormControl(null,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            lastName: new FormControl(null,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            cardType: new FormControl(null,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü' ]{1,30}$")
            ]),
            cardNumber : new FormControl (null, [
                Validators.required,
                Validators.pattern("^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$")
            ]),
            expMonth: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            expYear: new FormControl(null,[
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9][0-9]")
            ]),
            cvc: new FormControl(null, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9]")
            ]),
            street_address: new FormControl (null, [
                Validators.required,
                Validators.pattern("^[0-9]+ .+$")
            ]),
            city_address: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü' ]{1,30}$")
            ]),
            state_address: new FormControl(null,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü' ]{1,30}$")
            ]),
            zip_address: new FormControl(null, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9][0-9][0-9]")
            ]),
           customer_profile_id : new FormControl(this.auth.user.customer_profile_id)
        });
    }

    firstNameValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('firstName').status == VALID) {
            this.toastSuccess("Card Name Entered", "First name entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    lastNameValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('lastName').status == VALID) {
            this.toastSuccess("Card Name Entered", "Last name entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }
    cardTypeValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('cardType').status == VALID) {
            this.toastSuccess("Card Type Entered", "Card Type entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    cardNumberValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('cardNumber').status == VALID) {
            this.toastSuccess("Card Number Entered", "Credit card number entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    expMonthValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('expMonth').status == VALID) {
            this.toastSuccess("Expiration Month Entered", "Expiration month entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    expYearValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('expYear').status == VALID) {
            this.toastSuccess("Expiration Year Entered", "Expiration year entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    cvcValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('cvc').status == VALID) {
            this.toastSuccess("CVC Entered", "CVC entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    streetValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('street_address').status == VALID) {
            this.toastSuccess("Street Entered", "Street phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    cityValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('city_address').status == VALID) {
            this.toastSuccess("City Entered", "City phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    stateValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('state_address').status == VALID) {
            this.toastSuccess("State Entered", "State entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    zipValidate(ErrorTitle, ErrorMessage) {
        if (this.creditCardForm.get('zip_address').status == VALID) {
            this.toastSuccess("Zip Entered", "Zip entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    saveCreditCard(model: Payment, isValid: boolean) {
        if (!isValid) {
            console.log('Payment Form is not valid');
            console.log("1st")
            console.log(model, isValid);
        } else {
            console.log('Payment Form is valid');
            console.log(model, isValid);
            console.log("2end")
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            return this.http
                .post('http://localhost:4200/api/createPaymentMethod',

                 model,
                    {headers: headers})
                .map((res: Response) => res.json())
                .subscribe((res) => {
                  
                    //do something with the response here
                    console.log(res);
                    console.log("3th")
                   
                });
        }
    }

    toastWarning(ErrorTitle, ErrorMessage) {
        var toastOptions:ToastOptions = {
            title: ErrorTitle,
            msg: ErrorMessage,
            showClose: true,
            timeout: 7000,
            theme: 'bootstrap',
            onAdd: (toast:ToastData) => {
                console.log('Toast Warning ' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast Warning ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.warning(toastOptions);
    }

    toastSuccess(SuccessTitle, SuccessMessage) {
        var toastOptions:ToastOptions = {
            title: SuccessTitle,
            msg: SuccessMessage,
            showClose: true,
            timeout: 5000,
            theme: 'bootstrap',
            onAdd: (toast:ToastData) => {
                console.log('Toast Success' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast Success' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.success(toastOptions);
    }

    
}

