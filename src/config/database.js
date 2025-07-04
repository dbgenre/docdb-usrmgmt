const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

let client = null;
let adminDb = null;

const connectToDocDB = async () => {
  try {
    if (client) {
      return adminDb;
    }

    const connectionString = `mongodb://${process.env.DOCDB_ADMIN_USERNAME}:${process.env.DOCDB_ADMIN_PASSWORD}@${process.env.DOCDB_ENDPOINT}:${process.env.DOCDB_PORT}/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

    client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      tlsAllowInvalidHostnames: false,
    });

    await client.connect();
    adminDb = client.db('admin');

    // Verify connection
    await adminDb.command({ ping: 1 });
    logger.info('Successfully connected to DocumentDB');

    return adminDb;
  } catch (error) {
    logger.error('Error connecting to DocumentDB:', error);
    throw error;
  }
};

const getAdminDb = () => {
  if (!adminDb) {
    throw new Error('Database connection not initialized');
  }
  return adminDb;
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    adminDb = null;
    logger.info('Database connection closed');
  }
};

module.exports = {
  connectToDocDB,
  getAdminDb,
  closeConnection
};