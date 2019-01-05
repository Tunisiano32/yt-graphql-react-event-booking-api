const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

const app = express();
app.use(bodyParser.json());
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: resolvers,
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
