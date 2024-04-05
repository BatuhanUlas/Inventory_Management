import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router("express");
const device = require("../services/device");
const checkAuth = require("../middleware/check-auth");

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await device.getMultiple(res));
  } catch (err) {
    console.error("Error while reading all devices", err);
    next(err);
  }
});

router.post(
  "/",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await device.create(
          req.body,
          req.headers.authorization?.split(" ")[1],
          req.body.employee_id
        )
      );
    } catch (err) {
      console.error("Error while creating device", err);
      next(err);
    }
  }
);

router.get(
  "/:id",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.read(req.params.id));
    } catch (err) {
      console.error("Error in reading device", err);
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.update(req.params.id, req.body));
    } catch (err) {
      console.error("Error while updating device", err);
      next(err);
    }
  }
);

router.delete(
  "/:id",
  // checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.remove(req.params.id));
    } catch (err) {
      console.error("Error while deleting device");
      next(err);
    }
  }
);

module.exports = router;
