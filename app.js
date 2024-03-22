import express from "express";
import router from "./routes/Routes.js";
import connectDB from "./middlewares/Connect.js";
import "dotenv/config";
import rabbitConnect from "./async/AsyncConsume.js";
// import { Send } from "./async/AsyncSend.js";

const app = express();
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200);
  res.send("App - Message");
});

// app.post('/send', function(req, res) {
//   const rabbit = new Send().execute(req.body);

//   res.json({
//       status: 'OKE',
//       statusCode: 201,
//       message: 'Message success send to rabbitmq server.'
//   })
// });

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
