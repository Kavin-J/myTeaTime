import { model, Schema, Document, isObjectIdOrHexString } from 'mongoose';
import { User } from '@interfaces/users.interface';

const UserSchema: Schema<User> = new Schema<User>({
  // _id:String,
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  department: String,
  emp_id: String,
  name: String,
  profile_picture: String,
  role: String,
  subdepartment: String,
},{timestamps:true});

export const UserModel = model<User & Document>('User', UserSchema);
