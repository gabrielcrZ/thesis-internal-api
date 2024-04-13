import express from "express";
import router from "./routes/Routes.js";
import connectDB from "./middlewares/Connect.js";
import "dotenv/config";
import rabbitConnect from "./async/AsyncConsume.js";

const app = express();
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200);
  res.send("Shipping App - API");
});

const start = async () => {
  try {
    await connectDB();
    app.listen(
      process.env.PORT,
      console.log(`Server is listening on port ${process.env.PORT}...`)
    );

    await rabbitConnect();
  } catch (error) {
    console.log(error);
  }
};
start();
