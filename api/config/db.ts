import colors from "colors";
import { connect } from "mongoose";

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI as string);

        console.log(
            colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB
