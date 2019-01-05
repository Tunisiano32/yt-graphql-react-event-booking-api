

const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const { singleEvent, user, transformEvent} = require('./merge');

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

module.exports = {

  bookings: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error('Unauthorized');
      }
      const bookings = await Booking.find();
      return bookings.map(booking => transformBooking(booking));
    } catch (error) {
      throw error;      
    }
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth) {
      throw new Error('Unauthorized');
    }

    const event = await Event.findById(args.eventId);
    if(event) {
      const booking = new Booking({
        user: req.userId,
        event: event,
      });

      const result = await booking.save();
      return transformBooking(result); 
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error('Unauthorized');
      }
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (error) {
      throw error;      
    }
  }
}