export class Payment {
    constructor(
        public id: number,
        public email: string,
        public firstName: string,
        public lastName: string,
        public cardType: string,
        public cardNumber: string,
        public expMonth: string,
        public expYear: string,
        public cvc: string,
        public street_address: string,
        public city_address: string,
        public state_address: string,
        public zip_address: string,
        public customer_profile_id: string
  ) {  }
}