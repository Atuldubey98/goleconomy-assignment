import { Schema, model } from "mongoose";
export type RefreshTokenType = {
  userId: string;
  token: string;
};
const RefreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: { expires: "7d" },
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = model<RefreshTokenType>(
  "refreshToken",
  RefreshTokenSchema
);
export default RefreshToken;
