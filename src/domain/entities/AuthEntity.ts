export type SignUpData = {
  username: string;
  fullname: string;
  password: string;
  address: string;
  email: string;
  phonenumber: string;
  dob: string;
  roles: number[];
};

export type SignInData = { username: string; password: string };
