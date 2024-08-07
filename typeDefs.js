const { gql } = require('apollo-server');

const typeDefs = gql`
    type List {
        id: ID!
        title: String!
    }

    type Task {
        id: ID!
        title: String!
        listId: ID!
    }

    type User {
        id: ID!
        username: String!
        password: String!
    }

    type Query {
        getLists: [List]
        getList(id: ID!): List
        getTasks(listId: ID!): [Task]
        getTask(id: ID!): Task
        getUsers: [User]
        getUser(id: ID!): User
        getLegthSubTask(id: ID!) : Int
    }

    type Mutation {
        createList(title: String!): List
        updateList(id: ID!, title: String!): List
        deleteList(id: ID!): List

        createTask(title: String!, listId: ID!): Task
        updateTask(id: ID!, title: String!): Task
        deleteTask(id: ID!): Task

        createUser(username: String!, password: String!): User
        updateUser(id: ID!, username: String!, password: String!): User
        deleteUser(id: ID!): User
    }
`;

module.exports = typeDefs;
