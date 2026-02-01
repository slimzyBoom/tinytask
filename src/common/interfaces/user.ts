import { Types } from "mongoose";
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export interface TokenPayload {
  user_id: Types.ObjectId;
  tier: number;
}
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  phone_number?: string;
  password?: string;
  profile_pic?: {
    public_id: string;
    url: string;
  };
  profile_cover_pic?: {
    public_id: string;
    url: string;
  };
  university: string;
}

export interface IUserVerification {
  user_id: Types.ObjectId;
}

export interface IResponseInterface {
  success: Boolean;
  message: string;
  data?: any;
  errors?: any;
}
