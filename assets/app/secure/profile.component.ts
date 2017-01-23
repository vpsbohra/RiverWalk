import { Component, OnInit }                                    from '@angular/core';
import { Router }                                               from '@angular/router';
import { Http, Response, Headers }                              from '@angular/http';
import { FormGroup, Validators, FormControl }                   from "@angular/forms";
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Auth }                                                 from './../services/auth.service';
import { Profile }    			                                from './../models/profile';
import { VALID }                                                from "@angular/forms/src/model";

@Component({
    providers: [ Auth ],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    constructor(private router: Router, private auth: Auth, private http: Http, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {}

    profileForm: FormGroup;
    profile = new Profile( this.auth.user.id, this.auth.user.email, this.auth.user.first_name, this.auth.user.middle_name, this.auth.user.last_name, this.auth.user.dob, this.auth.user.ssn, this.auth.user.mobile_phone, this.auth.user.home_phone, this.auth.user.street_address, this.auth.user.city_address, this.auth.user.state_address, this.auth.user.zip_address, this.auth.user.customer_id, this.auth.user.customer_profile_id);
    states = ['Select State', 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    ngOnInit() {
        console.log(this.auth.user.customer_profile_id);
        this.profileForm = new FormGroup({
            id : new FormControl(this.auth.user.id,Validators.required ),
            email : new FormControl(this.auth.user.email,Validators.required ),
            first_name: new FormControl(this.auth.user.first_name,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            middle_name: new FormControl(this.auth.user.middle_name,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            last_name: new FormControl(this.auth.user.last_name,[
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü']{1,30}$")
            ]),
            dob : new FormControl (this.auth.user.dob, [
                Validators.required,
                Validators.pattern("[1][9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]|[2][0][0-9][0-9]-[0-9][0-9]-[0-9][0-9]")
            ]),
            ssn: new FormControl(this.auth.user.ssn, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]|[0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
            ]),
            mobile_phone: new FormControl(this.auth.user.mobile_phone, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]"),
            ]),
            home_phone: new FormControl(this.auth.user.home_phone, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
            ]),
            street_address: new FormControl (this.auth.user.street_address, [
                Validators.required,
                Validators.pattern("^[0-9]+ .+$")
            ]),
            city_address: new FormControl(this.auth.user.city_address, [
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü' ]{1,30}$")
            ]),
            state_address: new FormControl(this.auth.user.state_address, [
                Validators.required,
                Validators.pattern("^[a-zA-Zñáéíóúü' ]{1,30}$")
            ]),
            zip_address: new FormControl(this.auth.user.zip_address, [
                Validators.required,
                Validators.pattern("[0-9][0-9][0-9][0-9][0-9]")
            ]),
              customer_profile_id : new FormControl(this.auth.user.customer_profile_id)
        });

    }
FirstFun="";
    saveProfile(model: Profile, isValid: boolean) {
        if (!isValid) {
            console.log('Personal Form is not valid');
            console.log(model, isValid);
        } else {
            console.log('Profile Form is valid');
            console.log(model, isValid);
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            return this.http
                .post('http://localhost:4200/api/updateProfile',
                    model,
                    {headers: headers})
                .map((res: Response) => res.json())
                .subscribe((res) => {
                    //do something with the response here
                    console.log(res);
                    //this.profile=model;
                    //console.log("this data", this.profile);
                    localStorage.setItem("profileredirect", JSON.stringify(isValid));
                    var retrievedData = localStorage.getItem("profileredirect");
                    var profileValid = JSON.parse(retrievedData);
                  
                 });
                  
        }
      
    }

    emailValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('email').status == VALID) {
            this.toastSuccess("Email Entered", "Email entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    firstNameValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('first_name').status == VALID) {
            this.toastSuccess("First Name Entered", "First name entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    middleNameValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('middle_name').status == VALID) {
            this.toastSuccess("Middle Name Entered", "Middle name entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    lastNameValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('last_name').status == VALID) {
            this.toastSuccess("Last Name Entered", "Last name entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    dobValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('dob').status == VALID) {
            this.toastSuccess("DOB Entered", "DOB entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    ssnValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('last_name').status == VALID) {
            this.toastSuccess("SSN Entered", "SSN entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    mobilePhoneValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('mobile_phone').status == VALID) {
            this.toastSuccess("Mobile Phone Entered", "Mobile phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    homePhoneValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('home_phone').status == VALID) {
            this.toastSuccess("Home Phone Entered", "Home phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    streetValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('street_address').status == VALID) {
            this.toastSuccess("Street Entered", "Street phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    cityValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('city_address').status == VALID) {
            this.toastSuccess("City Entered", "City phone entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    stateValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('state_address').status == VALID) {
            this.toastSuccess("State Entered", "State entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
        }
    }

    zipValidate(ErrorTitle, ErrorMessage) {
        if (this.profileForm.get('zip_address').status == VALID) {
            this.toastSuccess("Zip Entered", "Zip entered correctly");
        } else {
            this.toastWarning(ErrorTitle, ErrorMessage);
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