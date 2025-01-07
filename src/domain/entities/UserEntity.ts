export type User = {
    id: number;
    username: string;
    fullname: string;
    address: string;
    email: string;
    phonenumber: string;
    dob: string;
    roles: string[];
};

export type UserToken = {
    user: User;
    token: string;
    refreshToken: string;
};

export type MGUser = {
    id: number | string;
    username: string;
    displayName: string;
    mail: string;
    companyName: string;
    authority: string;
    flag: boolean;
};
