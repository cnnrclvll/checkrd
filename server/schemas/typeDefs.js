const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    transactions: [Transaction]
    library: [Game]
  }

  type Game {
    _id: ID
    name: String
    storyline: String
    summary: String
    price: Float
    cover: String
    genres: [String]
  }

  type Genre {
    _id: ID
    name: String
  }

  type TransactionGame {
    game: ID
    price: Float
  }

  type Transaction {
    total: Float
    transaction_date: String
    games: [TransactionGame]
  }

  input TransactionInput {
    userId: ID!
    games: [ID!]!
  }

  type Auth {
    token: ID!
    user: User
  }
  
  type AuthPayload {
    success: Boolean!
    message: String
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    games: [Game]
    gamesByName(name: String!): [Game]
    gameById(id: ID!): Game
    gamesByGenre(name: String!): [Game]
    transactions(userId: ID!): [Transaction]
  }

  type Mutation {
    authenticateUser(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): Auth
    logout: Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    addTransaction(transaction: TransactionInput!): Transaction
  }
`;

module.exports = typeDefs;
