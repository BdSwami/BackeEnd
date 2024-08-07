const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

// In-memory mock data
let books = [
  { id: '1', title: 'Harry Potter and the Chamber of Secrets', author: 'J.K. Rowling' },
  { id: '2', title: 'Jurassic Park', author: 'Michael Crichton' },
];

const pubsub = new PubSub();

// Define your GraphQL schema
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(id: ID!): Book
  }

  type Subscription {
    bookAdded: Book
    bookDeleted: Book
  }
`;

// Define resolvers to handle GraphQL operations
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => books.find(book => book.id === args.id),
  },
  Mutation: {
    addBook: (parent, args) => {
      const newBook = { id: String(books.length + 1), title: args.title, author: args.author };
      books.push(newBook);
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook });
      return newBook;
    },
    deleteBook: (parent, args) => {
      const deletedBook = books.find(book => book.id === args.id);
      books = books.filter(book => book.id !== args.id);
      pubsub.publish('BOOK_DELETED', { bookDeleted: deletedBook });
      return deletedBook;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
    bookDeleted: {
      subscribe: () => pubsub.asyncIterator('BOOK_DELETED'),
    },
  },
};

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
server.listen(6000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
