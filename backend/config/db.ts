import colors from "colors";
import { connect } from "mongoose";

const connectDB = async () => {
    try {
        const conn = await connect("mongodb+srv://basitbalogun10:CYgM0wCBgYLGZnll@cluster0.ggdjua0.mongodb.net/?retryWrites=true&w=majority");

        console.log(
            colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB
