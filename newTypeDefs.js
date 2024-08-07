const { gql } = require('apollo-server');

const typeDefs = gql`
    type List {
        id: ID!
        title: String!
        userId: ID!
    }

    type Task {
        id: ID!
        title: String!
        listId: ID!
    }

    type newUser {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Query {
        getUsers: [newUser]
        getUser(id: ID!): newUser
        getLists(userId: ID!): [List]
        getList(id: ID!): List
        getTasks(listId: ID!): [Task]
        getTask(id: ID!): Task
        getLegthSubTask(id: ID!) : Int
    }

    type Mutation {
        createUser(username: String!, email: String! ,password: String!): newUser
        updateUser(id: ID!, username: String!,email: String! ,password: String!): newUser
        deleteUser(id: ID!): newUser

        createList(title: String!, userId: ID!): List
        updateList(id: ID!, title: String!): List
        deleteList(id: ID!): List

        createTask(title: String!, listId: ID!): Task
        updateTask(id: ID!, title: String!): Task
        deleteTask(id: ID!): Task
    }

    type Query {
        me: newUser
    }

    type Mutation {
        login(username: String!, password: String!): String
    }
`;

module.exports = typeDefs;
