const Event = require('../../models/event');
const User = require('../../models/user');
const events = async eventIds => {
  try {
    const events = await Event.find({_id : {$in: eventIds}});
    return events.map(event => transformEvent(event));
  } catch (error) {
    throw error;
  }
}

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return  transformEvent(event);
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
        ...user._doc, 
        _id: userId, 
        createdEvents: events.bind(this, user._doc.createdEvents)};
  } catch (error) {
    throw new Error('issue finding the user!!', error);
  }
}

const transformEvent = event => ({
  ...event._doc, 
  _id: event.id, 
  date: new Date(event._doc.date).toISOString(),
  creator: user.bind(this, event.creator)
});


exports.user = user;
exports.transformEvent = transformEvent;
exports.singleEvent = singleEvent;