export type BillModal = {
    _id: string,
    billStatus: boolean,
    vatFee: number,
    totalCarFee: number,
    depositFee: number,
    penaltyFee: number,
    realImage:string,
    realTimeDrop: string,
    realLocationDrop: string,
    request: RequestModal
}

export type RequestModal = {
    _id: string,
    requestStatus: string,
    isRequestDriver: boolean,
    timeCreated: string,
    dropLocation : string,
    emailRequest: string,
    endDate: string,
    pickUpLocation: string,
    startDate: string,
    user : UserModel | string,
    car: [CarModel],
}

export type UserModel = {
    _id?: string,
    userName: string,
    fullName?: string,
    phoneNumber: string,
    address?: string,
    avatar?: string,
    email?: string,
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
    cartype?: CarType,
}

export type CarType = {
    _id?: string,
    bunkBed: boolean,
    flue: number,
    transmissionType: boolean,
}
