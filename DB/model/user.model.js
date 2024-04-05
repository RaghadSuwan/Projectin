import mongoose, { Schema, model } from 'mongoose';
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,// هاي للداتا بيس valdition
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    confirmEmail: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Inactive'],
    },
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Admin'],
    },
  },
  {
    timestamps: true,//وينتا سجل
  }
);

const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;
