export type CarType = {
    _id ? : string,
    bunkBed : Boolean,
    flue : Number,
    transmissionType : Boolean,
}

export type CarModels = {
    _id: string,
    carName : string,
    carStatus : Boolean,
    carType : CarType,
    carVersion : number,
    color : string,
    licensePlateNumber: string,
    numberOfSeat: string,
    price: number,
    images: string[]
}

export type CarModelsNoId = {
    carName : string,
    carStatus : Boolean,
    carType : CarType,
    carVersion : number,
    color : string,
    licensePlateNumber: string,
    numberOfSeat: string,
    price: number[],
    images?: File[]
}