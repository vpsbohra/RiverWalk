import { Injectable }                      from '@angular/core';
import { tokenNotExpired, JwtHelper }      from 'angular2-jwt';
import { Router }                          from '@angular/router';
import { myConfig }                        from './auth.config';
import { Http, Response, Headers }         from '@angular/http';
import { User }                            from '../models/user';
import { LogReg }                          from '../models/logreg';

declare var Auth0Lock: any;

var options = {
    theme: {
    logo: '/img/logo.png',
    primaryColor: '#779476'
    },
    languageDictionary: {
    emailInputPlaceholder: "email@example.com",
    title: "Login or SignUp"
  }, 
 };

@Injectable()
export class Auth {
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options, {});
  userProfile: Object;
  logreg: LogReg;
  user: User;

  constructor(private router: Router, private http: Http ) {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem('access_token', authResult.idToken);
      this.lock.getProfile(authResult.idToken, (error: any, profile: any) => {
        if (error) {
          console.log(error);
          return;
        }
        
        // Login Or Register User On Our Server
        this.logreg = new LogReg(profile.email);   
        this.checkRegister(this.logreg).subscribe((res)=>{
            this.user = new User(res.id, res.user_auth_level, res.employee_owner, res.affiliate_owner, res.created_on, res.email, res.first_name, res.middle_name, res.last_name, res.dob, res.mobile_phone, res.home_phone, res.business_phone, res.fax_number, res.ssn, res.street_address, res.city_address, res.state_address, res.zip_address, res.account_locked, res.contract, res.customer_id, res.customer_profile_id);
            localStorage.setItem('user', JSON.stringify(this.user));
        });

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        console.log(this.userProfile);
        this.router.navigateByUrl('/overview');
      });
      this.lock.hide();
    });
  }

  public checkRegister(LogReg) {
    let body =  JSON.stringify(this.logreg);
    let headers = new Headers(); 
    headers.append('Content-Type', 'application/json');
      
      return this.http
      .post('http://localhost:4200/api/checkRegister', 
        body, 
        { headers: headers })
      .map((res:Response) => res.json());
  } 

  public login() {
    this.lock.show();
  }
  
  private get accessToken(): string {
        return localStorage.getItem('access_token');
    }

  public authenticated(): boolean {
    try {
        var jwtHelper: JwtHelper = new JwtHelper();
        var token = this.accessToken;
        if (jwtHelper.isTokenExpired(token))
            return false;
        return true;
    }
    catch (err) {
        return false;
    }
  }

  public logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('access_token');
    this.userProfile = undefined;
    this.router.navigateByUrl('/home');
  };
}