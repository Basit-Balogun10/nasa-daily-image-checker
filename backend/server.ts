import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { errorHandler} from "./middleware/errorMiddleware";

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", require("./routes/authRoutesRoutes"));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
