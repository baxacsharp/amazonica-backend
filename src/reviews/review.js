import express from "express";
import createError from "http-errors";
import { reviews } from "../db/db.js";
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const reviewRouter = express.Router();
reviewRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await reviews.findAll({ offset: 5, limit: 5 });
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
      const data = await reviews.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

reviewRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await reviews.findByPk(req.params.id);
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
      const review = await reviews.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(review);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const review = await reviews.destroy({ where: { id: req.params.id } });
      res.send("Deleted successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

// reviewRouter.get("/", async (req, res, next) => {
//     try {
//         const query = q2m(req.query)
//         console.log(query)
//         const total = await ReviewModel.countDocuments(query.criteria)
//         const limit = 25
//         const result = await ReviewModel.find(query.criteria)
//             .sort(query.options.sort)
//             .skip(query.options.skip || 0)
//             .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)
//         res.status(200).send({ links: query.links("/products", total), total, result })
//     } catch (error) {
//         next(error)
//     }
// })

// reviewRouter.get("/:id", async (req, res, next) => {
//     try {
//         const result = await ReviewModel.findById(req.params.id)
//         if (!result) createError(400, "id not found")
//         else res.status(200).send(result)
//     } catch (error) {
//         next(error)
//     }
// })

// reviewRouter.post("/:id", async (req, res, next) => {
//     try {
//         const entry = { ...req.body, productID: req.params.id }
//         const review = new ReviewModel(entry)
//         const { _id } = await review.save()

//         await ProductModel.findByIdAndUpdate(req.params.id, { $push: { reviews: _id } })

//         res.status(201).send(_id)
//     } catch (error) {
//         next(error)
//     }
// })

// reviewRouter.put("/:id", async (req, res, next) => {
//     try {
//         const result = await ReviewModel.findByIdAndUpdate(
//             req.params.id,
//             { ...req.body, updatedAt: new Date() },
//             { runValidators: true, new: true, useFindAndModify: false }
//         )
//         if (result) res.status(200).send(result)
//         else createError(400, "ID not found")
//     } catch (error) {
//         next(error)
//     }
// })

// reviewRouter.delete("/:id", async (req, res, next) => {
//     try {
//         const result = await ReviewModel.findByIdAndRemove(req.params.id, { useFindAndModify: false })
//         const { productId } = result
//         await ProductModel.findOneAndUpdate(
//             { _id: productId },
//             { $pull: { reviews: req.params.id } },
//             { new: true, useFindAndModify: false }
//         )

//         if (result) res.status(200).send("Deleted")
//         else createError(400, "ID not found")
//     } catch (error) {
//         next(error)
//     }
// })

export default reviewRouter;
