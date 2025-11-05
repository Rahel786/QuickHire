import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial data if database is empty
    await seedInitialData();
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Seed initial data
const seedInitialData = async () => {
  try {
    const { College } = await import('../models/College.js');
    
    // Check if colleges exist
    const collegeCount = await College.countDocuments();
    if (collegeCount === 0) {
      const colleges = [
        { name: 'IIT Delhi', abbreviation: 'IITD', type: 'IIT' },
        { name: 'IIT Bombay', abbreviation: 'IITB', type: 'IIT' },
        { name: 'IIT Madras', abbreviation: 'IITM', type: 'IIT' },
        { name: 'IIT Kanpur', abbreviation: 'IITK', type: 'IIT' },
        { name: 'IIT Kharagpur', abbreviation: 'IITKGP', type: 'IIT' },
        { name: 'IIT Roorkee', abbreviation: 'IITR', type: 'IIT' },
        { name: 'IIT Guwahati', abbreviation: 'IITG', type: 'IIT' },
        { name: 'IIT Hyderabad', abbreviation: 'IITH', type: 'IIT' },
        { name: 'IIT Indore', abbreviation: 'IITI', type: 'IIT' },
        { name: 'IIT Varanasi', abbreviation: 'IITBHU', type: 'IIT' },
        { name: 'BITS Pilani', abbreviation: 'BITS', type: 'Private' },
        { name: 'BITS Goa', abbreviation: 'BITS Goa', type: 'Private' },
        { name: 'BITS Hyderabad', abbreviation: 'BITS Hyd', type: 'Private' },
        { name: 'NIT Trichy', abbreviation: 'NITT', type: 'NIT' },
        { name: 'NIT Warangal', abbreviation: 'NITW', type: 'NIT' },
        { name: 'NIT Surathkal', abbreviation: 'NITK', type: 'NIT' },
        { name: 'NIT Calicut', abbreviation: 'NITC', type: 'NIT' },
        { name: 'NIT Rourkela', abbreviation: 'NITR', type: 'NIT' },
        { name: 'IIIT Hyderabad', abbreviation: 'IIITH', type: 'IIIT' },
        { name: 'IIIT Bangalore', abbreviation: 'IIITB', type: 'IIIT' },
        { name: 'IIIT Delhi', abbreviation: 'IIITD', type: 'IIIT' },
        { name: 'IIIT Allahabad', abbreviation: 'IIITA', type: 'IIIT' },
        { name: 'DTU', abbreviation: 'DTU', type: 'State' },
        { name: 'NSIT', abbreviation: 'NSIT', type: 'State' },
        { name: 'VIT Vellore', abbreviation: 'VIT', type: 'Private' },
        { name: 'SRM', abbreviation: 'SRM', type: 'Private' },
        { name: 'Manipal', abbreviation: 'MIT', type: 'Private' },
      ];
      await College.insertMany(colleges);
      console.log('📚 Seeded colleges data');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

