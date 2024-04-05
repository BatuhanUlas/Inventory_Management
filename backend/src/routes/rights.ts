import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const rights = require("../services/rights");

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await rights.getMultiple());
  } catch (err) {
    console.error("Error while reading rights", err);
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await rights.read(req.params.id));
  } catch (err) {
    console.log("Error in reading rights", err);
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await rights.create(req.body));
  } catch (err) {
    console.error("Error while creating rights", err);
    next(err);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await rights.update(req.params.id, req.body));
  } catch (err) {
    console.error("Error in updating rights", err);
    next(err);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await rights.remove(req.params.id));
    } catch (err) {
      console.error("Error while deleting rights:", err);
      next(err);
    }
  }
);

module.exports = router;
