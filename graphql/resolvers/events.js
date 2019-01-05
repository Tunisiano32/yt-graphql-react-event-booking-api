

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const { singleEvent, user, transformEvent} = require('./merge');


module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event =>  transformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error('Unauthorized');
      }
      const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: dateToString(args.eventInput.date),
          creator: req.userId,
      })
      let createdEvent;
  
      const result = await event.save();
      createdEvent =  transformEvent(result);
  
      const existingUser = await User.findById(req.userId);
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
}