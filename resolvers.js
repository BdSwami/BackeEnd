const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');
const { User } = require('./db/models/users.model');

const resolvers = {
    Query: {
        getLists: async () => await List.find().exec(),
        getList: async (_, { id }) => await List.findById(id).exec(),
        getTasks: async (_, { listId }) => await Task.find({ _listId: listId }).exec(),
        getTask: async (_, { id }) => await Task.findById(id).exec(),
        getUsers: async () => await User.find().exec(),
        getUser: async (_, { id }) => await User.findById(id).exec(),
        getLegthSubTask : async(obj,args,ctx,info)=>{
           const count = await Task.countDocuments({ _listId: args.id }).exec();
           console.log(count);
           return count;
        }
    },
    Mutation: {
        createList: async (_, { title }) => {
            const list = new List({ title });
            return await list.save();
        },
        updateList: async (_, { id, title }) => await List.findByIdAndUpdate(id, { title }, { new: true }).exec(),
        deleteList: async (_, { id }) => await List.findByIdAndDelete(id).exec(),

        createTask: async (_, { title, listId }) => {
            const task = new Task({ title, _listId: listId });
            return await task.save();
        },
        updateTask: async (_, { id, title }) => await Task.findByIdAndUpdate(id, { title }, { new: true }).exec(),
        deleteTask: async (_, { id }) => await Task.findByIdAndDelete(id).exec(),

        createUser: async (_, { username, password }) => {
            const user = new User({ username, password });
            return await user.save();
        },
        updateUser: async (_, { id, username, password }) => await User.findByIdAndUpdate(id, { username, password }, { new: true }).exec(),
        deleteUser: async (_, { id }) => await User.findByIdAndDelete(id).exec(),
    },
    Task: {
      listId: (task) => task._listId
  }
};

module.exports = resolvers;
