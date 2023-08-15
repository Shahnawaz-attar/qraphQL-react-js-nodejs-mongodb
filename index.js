const express = require("express");
const { graphqlHTTP } = require("express-graphql"); //middleware used to setting up a GraphQL server
const schema = require("./schema/taskSchema");

const cors = require("cors");

const app = express();
app.use(cors());

require("./db");
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
