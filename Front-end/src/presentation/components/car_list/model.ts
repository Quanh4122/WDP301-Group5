export type CarType = {
    _id ? : String,
    bunkBed : Boolean,
    flue : Number,
    transmissionType : Boolean,
}

export type CarModels = {
    _id?: String,
    carName : String,
    carStatus : Boolean,
    carType : CarType,
    carVersion : number,
    color : String,
    licensePlateNumber: String,
    numberOfSeat: String,
    price: number[],
    images: String[]
}