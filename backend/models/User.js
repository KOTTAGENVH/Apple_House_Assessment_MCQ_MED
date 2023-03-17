const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
//User Details :- Name,email and password only
  name: {  
    type: String,
    required: [true, 'is required']
  },


  email: {
    type: String,
    required: [true, 'is required'],
    unique: true,
    index: true,
    validate: {
      validator: function (str) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
      },
      message: props => `${props.value} is not a valid email`
    }
  },

  password: {
    type: String,
    required: [true, 'is required']
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

 
  feedbacks: {
    type: Array,
    default: []
  },

 


}, { minimize: false });

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('invalid credentials');
  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (isSamePassword) return user;
  throw new Error('invalid credentials');
}

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

//before saving => hash the password
UserSchema.pre('save', function (next) {

  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    })

  })

})

//Remove user check

UserSchema.pre('remove', function (next) {
  this.remove({ owner: this._id }, next);
})

const User = mongoose.model('User', UserSchema);

module.exports = User;