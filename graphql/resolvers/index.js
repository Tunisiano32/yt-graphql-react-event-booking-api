const usersResolver = require('./users');
const eventsResolver = require('./events');
const bookingsResolver = require('./bookings');

module.exports = {
  ...usersResolver,
  ...eventsResolver,
  ...bookingsResolver,
}