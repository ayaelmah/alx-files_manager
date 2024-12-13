import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import redisClient from '../utils/redis';
import User from '../models/User';

function decodeAuthHeader(authHeader) {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');
  return { email, password };
}

export const getConnect = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Basic')) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const { email, password } = decodeAuthHeader(authorization);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user.id, 'EX', 86400);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while authenticating' });
  }
};

export const getDisconnect = async (req, res) => {
  const { 'x-token': token } = req.headers;

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while disconnecting' });
  }
};
