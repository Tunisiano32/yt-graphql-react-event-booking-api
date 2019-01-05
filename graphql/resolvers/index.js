const usersResolver = require('./auth');
const eventsResolver = require('./events');
const bookingsResolver = require('./bookings');

module.exports = {
  ...usersResolver,
  ...eventsResolver,
  ...bookingsResolver,
}