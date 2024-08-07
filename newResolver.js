const { newList } = require('./db/models/newList');
const { newTask } = require('./db/models/newTask');
const { newUser } = require('./db/models/newUser');
const { AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        getUsers: async () => {
        try {
            const users = await newUser.find();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        }
        },
        getUser: async (_, { id }) => {
            try {
                const user = await newUser.findById(id);
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            } catch (error) {
                console.error('Error fetching user:', error);
                throw new Error('Error fetching user');
            }
        },

        getLists: async(_, {userId}) => {
            try{
                const list = await newList.find({_userId : userId});
                console.log(list,"list");
                return list;
            }catch (error) {
                console.log("nksadnfkasfn");
                
                console.error('Error fetching users:', error);
                throw new Error('Error fetching users');
            }
        },
        getList: async (_, { id }) => await newList.findById(id).exec(),

        getTasks: async (_, { listId }) => await newTask.find({ _listId: listId }).exec(),
        getTask: async (_, { id }) => await newTask.findById(id).exec(),
        getLegthSubTask : async(obj,args,ctx,info)=>{
           const count = await Task.countDocuments({ _listId: args.id }).exec();
           console.log(count);
           return count;
        },

        me : (parent, args, context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in');
            return context.user;
          },
    },
    Mutation: {
        createUser: async (_, { username, email, password }) => {
            try {
                console.log(username,"ljhnedfkusd");
                
                const User = new newUser({ username, email, password });
                await User.save();
                return User;
            } catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Error creating user');
            }
        },
        updateUser: async (_, { id, username, email, password }) => {
            try {
                const updatedUser = await newUser.findByIdAndUpdate(
                    id,
                    { username, email, password },
                    { new: true }
                );
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            } catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Error updating user');
            }
        },
        deleteUser: async (_, { id }) => {
            try {
                const deletedUser = await newUser.findByIdAndRemove(id);
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return deletedUser;
            } catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Error deleting user');
            }
        },
    // Implement other mutations similarly

        createList: async (_, { title, userId}) => {
            try {
                const newList = new newList({ title, _userId : userId });
                await newList.save();
                return newList;
            } catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Error creating user');
            }
        },
    
        updateList: async (_, { id, title }) => await newList.findByIdAndUpdate(id, { title }, { new: true }).exec(),
        deleteList: async (_, { id }) => await newList.findByIdAndDelete(id).exec(),

        createTask: async (_, { title, listId }) => {
            const task = new newTask({ title, _listId: listId });
            return await task.save();
        },
        updateTask: async (_, { id, title }) => await newTask.findByIdAndUpdate(id, { title }, { new: true }).exec(),
        deleteTask: async (_, { id }) => await newTask.findByIdAndDelete(id).exec(),

        login: async (parent, { username, password }) => {
            // Replace this with real authentication logic
            const user = await findUserByEmail(username);            

            if (username === user.email && password === user.password) {
              const token = jwt.sign({ username }, 'your_jwt_secret');
              return token;
            }
            throw new AuthenticationError('Invalid credentials');
        }
    },
    Task: {
      listId: (task) => task._listId
  }
};

async function findUserByEmail(email) {
    try {
      const user = await newUser.findOne({ email: email }).exec();
      console.log(user, "find");
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
    }
  }
module.exports = resolvers;
