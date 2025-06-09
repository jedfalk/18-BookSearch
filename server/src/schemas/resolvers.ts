import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';

import type { IResolvers } from '@graphql-tools/utils';
import type { Context } from '../types/context';

const resolvers: IResolvers = {
  Query: {
    me: async (_parent, _args, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }
      return await User.findById(context.user._id);
    }
  },

  Mutation: {
    login: async (_parent, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (
      _parent,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent, { bookData }: { bookData: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    removeBook: async (_parent, { bookId }: { bookId: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    }
  }
};

export default resolvers;
