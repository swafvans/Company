const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the MONGODB_URI from your .env file
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options to avoid deprecation warnings (might vary slightly based on mongoose version)
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, // No longer needed in Mongoose 6+
            // useFindAndModify: false // No longer needed in Mongoose 6+
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;