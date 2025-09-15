import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-commute-optimizer';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      // Connection pool settings
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      
      // Buffering settings
      bufferMaxEntries: 0,
      
      // Heartbeat settings
      heartbeatFrequencyMS: 10000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    // Set up event listeners
    mongoose.connection.on('connected', () => {
      logger.info(`MongoDB connected to ${MONGODB_URI}`);
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
      }
    });

    // Create geospatial indexes for location-based queries
    await createIndexes();

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => mongoose.connection.once('open', resolve));
    }

    // Create geospatial indexes for routes collection
    const routesCollection = mongoose.connection.db.collection('routes');
    
    await routesCollection.createIndexes([
      // Geospatial index for start location
      {
        key: { startLocation: '2dsphere' },
        name: 'startLocation_2dsphere'
      },
      // Geospatial index for end location
      {
        key: { endLocation: '2dsphere' },
        name: 'endLocation_2dsphere'
      },
      // Geospatial index for route geometry
      {
        key: { routeGeometry: '2dsphere' },
        name: 'routeGeometry_2dsphere'
      },
      // Index for user-based queries
      {
        key: { userId: 1, isActive: 1 },
        name: 'userId_isActive_index'
      },
      // Index for active routes
      {
        key: { isActive: 1, createdAt: -1 },
        name: 'isActive_createdAt_index'
      }
    ]);

    // Create indexes for users collection
    const usersCollection = mongoose.connection.db.collection('users');
    
    await usersCollection.createIndexes([
      // Unique index for email
      {
        key: { email: 1 },
        name: 'email_unique_index',
        unique: true
      },
      // Unique index for anonymous username
      {
        key: { anonymousUsername: 1 },
        name: 'anonymousUsername_unique_index',
        unique: true
      },
      // Index for verification status
      {
        key: { verificationStatus: 1, isActive: 1 },
        name: 'verificationStatus_isActive_index'
      }
    ]);

    // Create indexes for matches collection
    const matchesCollection = mongoose.connection.db.collection('matches');
    
    await matchesCollection.createIndexes([
      // Index for user-based match queries
      {
        key: { users: 1, status: 1 },
        name: 'users_status_index'
      },
      // Index for route-based match queries
      {
        key: { routes: 1, status: 1 },
        name: 'routes_status_index'
      },
      // Index for active matches
      {
        key: { status: 1, createdAt: -1 },
        name: 'status_createdAt_index'
      }
    ]);

    // Create indexes for chatmessages collection
    const chatMessagesCollection = mongoose.connection.db.collection('chatmessages');
    
    await chatMessagesCollection.createIndexes([
      // Index for room-based message queries
      {
        key: { roomId: 1, timestamp: -1 },
        name: 'roomId_timestamp_index'
      },
      // Index for sender-based queries
      {
        key: { senderId: 1, timestamp: -1 },
        name: 'senderId_timestamp_index'
      }
    ]);

    // Create indexes for reports collection
    const reportsCollection = mongoose.connection.db.collection('reports');
    
    await reportsCollection.createIndexes([
      // Index for reported user queries
      {
        key: { reportedUserId: 1, status: 1 },
        name: 'reportedUserId_status_index'
      },
      // Index for reporter queries
      {
        key: { reporterId: 1, createdAt: -1 },
        name: 'reporterId_createdAt_index'
      }
    ]);

    logger.info('Database indexes created successfully');

  } catch (error) {
    logger.error('Error creating database indexes:', error);
    // Don't throw error here as the app should still work without indexes
  }
};

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const state = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Get database statistics
export const getDatabaseStats = async (): Promise<any> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const stats = await mongoose.connection.db.stats();
    
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects
    };
  } catch (error) {
    logger.error('Error getting database stats:', error);
    throw error;
  }
};