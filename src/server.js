import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import db from "../src/db/db.js";
import productRoutes from "./products/products.js";
import reviewRoutes from "./reviews/review.js";
import categoryRoutes from "./category/category.js";
import userRouter from "./user/user.js";
import cartRouter from "./cart/cart.js";
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  notFoundErrorHandler,
  catchAllErrorHandler,
} from "./helpers/errorHandlers.js";

// import logModel from "./schema/log.js"
// import mongoose from "mongoose"
import createError from "http-errors";

const server = express();
const port = process.env.PORT || 5000;

// const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_PROD_URL, "bypass"]
// const corsOptions = {
//     origin: (origin, next) => {
//         try {
//             if (whitelist.indexOf(origin) !== -1) {
//                 next(null, true)
//             } else {
//                 next(createError(400, "Cross-Site Origin Policy blocked your request"), true)
//             }
//         } catch (error) {
//             next(error)
//         }
//     }
// }

server.use(cors());
server.use(express.json());

// ##### Global Middleware #####
// const logger = async (req, res, next) => {
//     try {
//         const entry = new logModel({
//             method: req.method,
//             query: req.query,
//             params: req.params,
//             body: req.body
//         })
//         await entry.save()
//         next()
//     } catch (error) {
//         next(error)
//     }
// }
// server.use();

server.use("/products", productRoutes);
server.use("/reviews", reviewRoutes);
server.use("/category", categoryRoutes);
server.use("/user", userRouter);
server.use("cart", cartRouter);

server.use(badRequestErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

// mongoose.connect("mongodb://localhost:27017/demobase", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//     server.listen(port, () => {
//         console.table(listEndpoints(server))
//         console.log("server is running on port: ", port)
//     })
// })
db.sync({ alter: true })
  .then(() => {
    server.listen(port, () => console.log("server is running: " + port));
    server.on("error", (error) =>
      console.info(" ❌ Server is not running due to : ", error)
    );
  })
  .catch((e) => console.log(e));
console.table(listEndpoints(server));
