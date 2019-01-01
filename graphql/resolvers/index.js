
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {
    const events = await Event.find({_id : {$in: eventIds}});
    return events.map(event => {
      return {
          ...event._doc, 
          _id: event.id, 
          creator: user.bind(this, event.creator.id)}
      });
  } catch (error) {
    throw error;
  }
}

const user = async user => {
  try {
    const user = await User.findById(userId);
    return {
        ...user._doc, 
        _id: user.id, 
        createdEvents: events.bind(this, user._doc.createdEvents)};
  } catch (error) {
    throw new Error('issue finding the user!!', error);
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
          return {
              ...event._doc, 
              _id: event.id,
              creator: user.bind(this, event._doc.creator.id)
          };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5c2aa7ad36e5aadbc0abffca'
      })
      let createdEvent;
  
      const result = await event.save();
      createdEvent = {...result._doc, _id: result.id, creator: user.bind(this, result._doc.creator.id)};
  
      const existingUser = await User.findById('5c2aa7ad36e5aadbc0abffca');
      if(existingUser) {
        existingUser.createdEvents.push(event);
          await existingUser.save();
      }else{
        throw new Error("user not found");
      }
      return createdEvent;

    } catch (error) {
      throw error;
    }
  },
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