export type UserModel = {
    _id?: string,
    userName: string,
    fullName?: string,
    phoneNumber: string,
    address?: string,
    avatar?: string,
    email?: string,
}

export type RequestModel = {
    user? : string,
    driver? : string,
    car?: string[],
    startDate? : any,
    endDate? : any,
    isRequesDriver? : boolean,
}
export type RequestModelFull = {
    _id: any,
    user?: UserModel,
    car: [CarModel],
    driver?: [DriverModel],
    startDate: any,
    endDate: any,
    requestStatus: string,
    isRequestDriver?: Boolean,
    timeCreated? : string,
    pickUpLocation: string,
    emailRequest?: string,
}

export type RequestModalForCallApi = {
    user?: string,
    car?: string[],
    driver?: string[],
    startDate: any,
    endDate: any,
    requestStatus: string,
    isRequestDriver?: Boolean
}

export type RequestAcceptForApi = {
    user?: UserModel,
    startDate: any,
    endDate: any,
    requestStatus: string,
    isRequestDriver?: Boolean,
    car? :string[],
    pickUpLocation?: string,
    dropLocation?: string,
    _id?: string,
    emailRequest?: string,
}

export type CarModel = {
    _id: string,
    carName : string,
    carVersion : number,
    color : string,
    licensePlateNumber: string,
    numberOfSeat?: string,
    price: number,
    images: string[],
    carType?: CarType
}

export type DriverModel = {
    name: string, 
    age: string,
    image: string,
}

export type CarType = {
    _id?: string,
    bunkBed: boolean,
    flue: number,
    transmissionType: boolean,
}

export type RequestUserBookingToBill = {
    request : RequestDataToBill,
    billData: BillInfoUserBooking
    userName?: string,
}

export type RequestDataToBill = {
    _id?: string,
    userId?: string,
    startDate: any,
    endDate: any,
    requestStatus: string,
    isRequestDriver?: Boolean,
    car? :string[],
    pickUpLocation?: string,
    dropLocation?: string,
    emailRequest?: string,
}

export type BillInfoUserBooking = {
    vatFee: number,
    totalCarFee: number,
    depositFee: number
}