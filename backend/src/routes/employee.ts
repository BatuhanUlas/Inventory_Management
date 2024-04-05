import { Request, Response, NextFunction } from "express";
import { FileFilterCallback } from "multer";
const express = require("express");
const router = express.Router();
const employee = require("../services/employee");
const device = require("../services/device");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

//Image upload
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    cb(null, `src/uploads/profilepictures/`);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, new Date().toISOString().slice(0, 10) + file.originalname);
  },
});


const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/jepg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.get(
  "/",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await employee.readCheckRights(req.headers.authorization?.split(" ")[1])
      );
    } catch (err) {
      console.log("Error while reading employees: ", err);
      next(err);
    }
  }
);

router.get(
  "/:id",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await employee.read(req.params.id));
    } catch (err) {
      console.error("Error while reading employee: ", err);
      next(err);
    }
  }
);

router.get(
  "/:employeeId/device/:deviceId",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.read(req.params.employeeId, req.params.deviceId));
    } catch (err) {
      console.error("Error in reading employee with one device", err);
      next(err);
    }
  }
);

router.get(
  "/:id/devices",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.getMultiple(req.params.id));
    } catch (err) {
      console.error("Error in reading employee with devices", err);
      next(err);
    }
  }
);

router.get(
  "/search/:searchString",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await employee.search(req.params.searchString));
    } catch (err) {
      console.log("Error in search function", err);
      next(err);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await employee.create(req.body));
  } catch (err) {
    console.error("Error while creating employee:", err);
    next(err);
  }
});

router.post(
  "/:id/devices",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await device.create(req.params.id, req.body));
    } catch (err) {
      console.log("Error in creating employee devices", err);
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await employee.login(req.body.email, req.body.password, res);
    } catch (err) {
      console.error("Error while login employee: ", err);
      next(err);
    }
  }
);

router.put(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await employee.resetPassword(
        req.body.email,
        req.body.employeeNumber,
        req.body.newPassword,
        res
      );
    } catch (err) {
      console.error("Error while reseting Password:", err);
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await employee.update(
          req.params.id,
          req.body,
          req.headers.authorization?.split(" ")[1]
        )
      );
    } catch (err) {
      console.error("Error while updating user: ", err);
      next(err);
    }
  }
);

router.delete(
  "/:id",
  checkAuth.checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(
        await employee.remove(
          req.params.id,
          req.headers.authorization?.split(" ")[1]
        )
      );
    } catch (err) {
      console.error("Error while deleting employee: ", err);
      next(err);
    }
  }
);

module.exports = router;
