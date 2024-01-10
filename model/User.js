// models/User.js
import { model, models, Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  address:{type:Object,
    default:{
    street:"",
    city:"",
    pincode:"",
    state:""
  }
  },
  isAdmin: { type: Boolean, default: false },
  picture: {
    type: String, default:"./pictures/no-profile.png",
  },
  cart:Array,
  orders:Array
});

const User = models?.User || model('User', userSchema);

export default User;



