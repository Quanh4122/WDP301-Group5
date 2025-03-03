export type UserModel = {
    _id: string,
    userName: string,
    fullName: string,
    phoneNumber: string,
    address: string,
    avatar: string,
    email?: string,
}

export type RequestModel = {
    userId? : string,
    driverId? : string,
    carId?: string,
    startDate? : string,
    endDate? : string,
    isRequesDriver? : boolean,
}