const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

const eventsList = [];
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!,
            email: String!,
            password: String
        }

        input UserInput {
            email: String!,
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find({})
            .then(events => {
                return events.map(event => {
                    return {...event._doc, _id: event.id };
                });
            })
            .catch(err => { throw err;})
      },
      createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5c2aa7ad36e5aadbc0abffca'
        })
        let createdEvent;

        return event.save()
            .then(result => {
                createdEvent = {...result._doc, _id: result.id };
                return User.findById('5c2aa7ad36e5aadbc0abffca');
            })
            .then(user => {
                if(user) {
                    user.createdEvents.push(event);
                    return user.save();
                }
                throw new Error("user not found");
            })
            .then(res => {
                return createdEvent;
            })
            .catch(err => console.log(err))
      },
      createUser: args => {
          return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user) {
                    throw new Error('user exists')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc, password: null, id: result.id}
            })
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASS
    }@cluster0-r1rcq.mongodb.net/${process.env.Mongo_DBNAME}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000, () => console.log(`The app listening on port 3000!`));
  })
  .catch(err => console.log(err));
