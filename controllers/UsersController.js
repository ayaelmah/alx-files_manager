import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import redisClient from '../utils/redis';
import User from '../models/User';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const userQueue = require('./.../utils/worker');

const dbName = 'files_manager';
const collectionName = 'users';

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex');

    const newUser = {
      email,
      password: sha1Hash,
    };

    const result = await collection.insertOne(newUser);

    return res.status(201).json({
      id: result.insertedId,
      email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'An error occurred while creating the user' });
  } finally {
    await client.close();
  }
};

export const getMe = async (req, res) => {
  const { 'x-token': token } = req.headers;
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(userId).select('email id');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while getting the user' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.create({ email, username, password });

    await userQueue.add({
      userId: newUser.id,
    });

    return res.status(201).json(
      message: 'User created successfully',
      userId: newUser.id,
    );
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while creating the user' });
  }
};

export default {
  postNew,
};
