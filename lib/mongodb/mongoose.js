import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
    mongoose.set("strictQuery", true);
    if(initialized) {
        console.log("MongoDB is already initialized.")
        return;
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "realmont",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        initialized = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}