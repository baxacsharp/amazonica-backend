import express from "express";
import createError from "http-errors";
import { category, products, shoppingCart } from "../db/db.js";
import sequelize from "../db/db.js";
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const cartRouter = express.Router();
cartRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await shoppingCart.findAll();
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await shoppingCart.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });
cartRouter.route("/:userId/user").get(async (req, res, next) => {
  try {
    const userCart = await shoppingCart.findAll({
      where: { userId: req.params.id },
      include: { model: products, include: category },
      attributes: [
        "productId",
        "userId",
        [sequelize.fn("count", "id"), "cart_qty"],
        [sequelize.fn("sum", sequelize.col("product.price"), "cart_sum")],
      ],
      group: ["productId", "userId", "product.id", "product.category.id"],
    });
    res.send(userCart);
  } catch (error) {
    console.log(e);
    next(createError(500, "Oops something went wrong, please try again later"));
  }
});
cartRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await shoppingCart.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .put(async (req, res, next) => {
    try {
      const shoppingCarts = await shoppingCart.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(shoppingCarts);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const shoppingCarts = await shoppingCart.destroy({
        where: { id: req.params.id },
      });
      res.send("Deleted successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });
export default cartRouter;
