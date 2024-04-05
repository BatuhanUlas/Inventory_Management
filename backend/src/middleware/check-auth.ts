import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token not set",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //@ts-ignore
    req.userData = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(500).json({
        message: "Invalid token or signature",
      });
    } else {
      return res.status(500).json({
        message: "Unexpected Error in Token",
      });
    }
  }
};

module.exports = { checkAuth };
