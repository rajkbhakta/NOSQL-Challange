const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
   username: {
    type:String,
    unique :  true,
    required: "please enter a username",
    trim : true,
   },
   email: {
    type:String,
    unique :  true,
    required: "please enter a username",
    trim : true,
   },
   thoughts: {
    type : Schema.types.objectId,
    ref: "Thought"
   },
   friends : {
    type : Schema.types.objectId,
    ref: "User"
   }
  }
);

// Create a virtual property `friendCount` that gets and sets the user's full name
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.frined.length;
  })
 

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
