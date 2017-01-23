export class Profile {
    constructor(
        public id: number,
        public email: string,
        public first_name: string,
        public middle_name: string,
        public last_name: string,
        public dob: string,
        public mobile_phone: string,
        public home_phone: string,
        public ssn: string,
        public street_address: string,
        public city_address: string,
        public state_address: string,
        public zip_address: string,
        public customer_id: boolean,
        public customer_profile_id: string
    ) {  }
}