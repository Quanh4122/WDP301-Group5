export type UserModel = {
    _id: string,
    userName: string,
    fullName: string,
    phoneNumber: string,
    address: string,
    avatar?: string,
    email?: string,
}

export type RequestModel = {
    userId? : string,
    driverId? : string,
    carId?: string,
    startDate? : any,
    endDate? : any,
    isRequesDriver? : boolean,
}
export type RequestModelFull = {
    user: UserModel,
    car: CarModel,
    driver?: DriverModel,
    startDate: Date,
    endDate: Date,
    requestStatus: String,
    isRequestDriver?: Boolean
}

export type CarModel = {
    _id: String,
    carName : String,
    carVersion : number,
    color : String,
    licensePlateNumber: String,
    numberOfSeat?: String,
    price: number,
}

export type DriverModel = {
    name: String, 
    age: String,
    image: String,
}