import express from "express";
import createError from "http-errors";
import { category, products } from "../db/db.js";
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const categoryRouter = express.Router();
categoryRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await category.findAll({ include: products });
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
      const data = await category.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

categoryRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await category.findByPk(req.params.id);
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
      const categories = await category.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(categories);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const categories = await category.destroy({
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
export default categoryRouter;
