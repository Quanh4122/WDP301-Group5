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
    car: [CarModel],
    driver?: DriverModel,
    startDate: Date,
    endDate: Date,
    requestStatus: string,
    isRequestDriver?: Boolean
}

export type CarModel = {
    _id: string,
    carName : string,
    carVersion : number,
    color : string,
    licensePlateNumber: string,
    numberOfSeat?: string,
    price: number,
    images: string[]
}

export type DriverModel = {
    name: string, 
    age: string,
    image: string,
}