const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({email: args.userInput.email});
      if(existingUser) {
          throw new Error('user exists')
      }

      const user = new User({
          email: args.userInput.email,
          password: await bcrypt.hash(args.userInput.password, 12),
      });
      const result = await user.save();
      return {...result._doc, password: null, id: result.id}
    } catch (error) {
      throw error;
    }
  }
}