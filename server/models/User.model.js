import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";



const UserSchema = new Schema({
    pseudo : {
        type: String,
        required: true,
        unique: true,
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
    role : {
      type : String,
      enum : ["admin", "user"],
      default: "user",
      message: "{VALUE} is not supported"
    },
  }, { timestamps: true });
  
  UserSchema.virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

UserSchema.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Password must match confirm password");
  }
  next();

});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      });
  });
  
  const User = model("User", UserSchema);
  export default User;