const { User, Game } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { id }) => {
      return User.findById(id).populate('library');
    },
    games: async () => {
      return Game.find();
    },
    gameById: async (parent, { id }) => {
      return Game.findById(id);
    },
    gamesByName: async (parent, { name }) => {
      return Game.find({ name: { $regex: name, $options: 'i' } });
    },
    gamesByGenre: async (parent, { name }) => {
      return Game.find({ genres: { $regex: name, $options: 'i' } });
    },
    transactions: async (parent, { userId }) => {
      const user = await User.findById(userId);
      return user.transactions;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      if (!user) {
        throw new AuthenticationError('User was not created!');
      }
      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('No user found with this username');
      }

      const correctPw = await user.comparePassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    },
    addTransaction: async (parent, { transaction }) => {
      console.log("hello")
      console.log(transaction)
      const { userId, games } = transaction;
      const user = await User.findById(userId);
      if (!user) throw new AuthenticationError();

      let total = 0;
      const transactionGames = [];
      for (let i = 0; i < games.length; i++) {
        if (user.library.includes(games[i])) throw new Error('You already own this game!');
        const game = await Game.findById(games[i]);
        total += game.price;
        transactionGames.push({ game: game._id, price: game.price });
      }

      const newTransaction = {
        transaction_date: new Date(),
        total: total,
        games: transactionGames,
      };

      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { transactions: newTransaction, library: { $each: games } } }
      );

      return newTransaction;
    },
  },
};

module.exports = resolvers;
