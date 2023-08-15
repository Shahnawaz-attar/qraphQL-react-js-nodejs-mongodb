const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLSchema,
} = require("graphql");
const Task = require("../model/task");

// Define the TaskType, which represents the structure of a single task.
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID }, // The unique identifier for a task.
    title: { type: GraphQLString }, // The title of the task.
    description: { type: GraphQLString }, // The description of the task.
  }),
});

// Define the RootQuery, which specifies how you can fetch data from the server.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    tasks: {
      type: new GraphQLList(TaskType), // Represents a list of tasks.
      resolve() {
        return Task.find(); // Retrieve tasks from the database using Mongoose.
      },
    },
    task: {
      type: TaskType, // Represents a single task.
      args: { id: { type: GraphQLID } }, // The argument to identify a task by its ID.
      resolve(parent, args) {
        return Task.findById(args.id); // Retrieve a task by ID from the database using Mongoose.
      },
    },
  },
});

// Define the Mutation, which specifies how you can modify data on the server.
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTask: {
      type: TaskType, // Represents the type of task returned by this mutation.
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) }, // Title of the new task (required).
        description: { type: new GraphQLNonNull(GraphQLString) }, // Description of the new task (required).
      },
      resolve(parent, args) {
        const task = new Task({
          title: args.title,
          description: args.description,
        });
        return task.save(); // Save the new task to the database using Mongoose.
      },
    },
    updateTask: {
      type: TaskType, // Represents the type of task returned by this mutation.
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }, // ID of the task to be updated (required).
        title: { type: new GraphQLNonNull(GraphQLString) }, // New title for the task (required).
        description: { type: new GraphQLNonNull(GraphQLString) }, // New description for the task (required).
      },
      resolve(parent, args) {
        return Task.findByIdAndUpdate(
          args.id,
          {
            title: args.title,
            description: args.description,
          },
          { new: true }
        ); // Update the task in the database and return the updated task.
      },
    },
    deleteTask: {
      type: TaskType, // Represents the type of task returned by this mutation.
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // ID of the task to be deleted (required).
      resolve(parent, args) {
        return Task.findByIdAndRemove(args.id); // Delete the task from the database using Mongoose and return the deleted task.
      },
    },
  },
});

// Create a new GraphQLSchema instance that includes the RootQuery and Mutation.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
