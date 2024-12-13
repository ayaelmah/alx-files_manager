import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    try {
      const redisStatus = redisClient.isAlive();
      const dbStatus = await dbClient.isAlive();
      return res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      console.error('Error getting status:', error);
      return res.status(500).json({ error: 'An error occurred while checking Redis status' });
    }
  }

  static async getStats(req, res) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();
      return res.status(200).json({ users, files });
    } catch (error) {
      console.error('Error getting stats:', error);
      return res.status(500).json({ error: 'An error occurred while getting stats' });
    }
  }
}

export default AppController;
