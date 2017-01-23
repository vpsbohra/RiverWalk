export class User {
  constructor(
    public id: number,
    public user_auth_level: number,
    public employee_owner: string,
    public affiliate_owner: string,
    public created_on: string,
    public email: string,
    public first_name: string,
    public middle_name: string,
    public last_name: string,
    public dob: string,
    public mobile_phone: string,
    public home_phone: string,
    public business_phone: string,
    public fax_number: string,
    public ssn: string,
    public street_address: string,
    public city_address: string,
    public state_address: string,
    public zip_address: string,
    public account_locked: boolean,
    public contract: boolean,
    public customer_id: boolean,
    public customer_profile_id: string
  ) {  }
}
