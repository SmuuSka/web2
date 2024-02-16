/* eslint-disable-next-line padded-blocks */

//import {GraphQLError} from 'graphql';
import catModel from '../models/catModel';
import {Cat} from '../../types/DBTypes';
//import mongoose from 'mongoose';

// TODO: create resolvers based on cat.graphql
// note: when updating or deleting a cat, you need to check if the user is the owner of the cat
// note2: when updating or deleting a cat as admin, you need to check if the user is an admin by checking the role from the user object
// note3: updating and deleting resolvers should be the same for users and admins. Use if statements to check if the user is the owner or an admin
export default {
  Query: {
    cats: async () => {
      return [];
    },
    catById: async (args: {id: string}) => {
      return catModel.findById(args.id);
    },
  },
  Mutation: {
    createCat: async (args: {cat: Cat}) => {
      return await catModel.create(args.cat);
    },
  },
};
