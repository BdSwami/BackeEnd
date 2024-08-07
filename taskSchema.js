const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const Task = require('./db/models/task.model');  // Path to your Task model

// Define the Task GraphQL Type
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    listId: { type: GraphQLID }  // Reference to the List ID
  })
});

// Define the Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Fetch a single task by ID
    task: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Task.findById(args.id);
      }
    },
    // Fetch all tasks
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({});
      }
    }
  }
});

// Define the Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a new task
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        listId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        const task = new Task({
          title: args.title,
          _listId: args.listId
        });
        return task.save();
      }
    },
    // Update an existing task
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        listId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Task.findByIdAndUpdate(args.id, {
          title: args.title,
          _listId: args.listId
        }, { new: true });
      }
    },
    // Delete a task
    deleteTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Task.findByIdAndRemove(args.id);
      }
    }
  }
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
