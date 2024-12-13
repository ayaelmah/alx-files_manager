import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUniFiedTopology: true });
    this.database = database;
  }

  async isAlive() {
    try {
      await this.client.connect();
      const admin = this.client.db().admin();
      const info = await admin.ping();
      console.log('MongoDB ping response:', info);
      return info.ok === 1;
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
      return false;
    } finally {
      await this.client.close();
    }
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const userCount = await usersCollection.countDocuments();
      return userCount;
    } catch (error) {
      console.log('Error getting user count from MongoDB:', error);
      return 0;
    } finally {
      await this.client.close();
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const db = this.client.db(this.database);
      const filesCollection = db.collection('files');
      const fileCount = await filesCollection.countDocuments();
      return fileCount;
    } catch (error) {
      console.log('Error getting file count from MongoDB:', error);
      return 0;
    } finally {
      await this.client.close();
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
