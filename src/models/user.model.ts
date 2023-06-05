import { Schema, model } from "mongoose";
export type UserModelType = {
  email: string;
  name: string;
  password: string;
};
const UserSchema = new Schema<UserModelType>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 6 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User = model<UserModelType>("user", UserSchema);
export default User;
