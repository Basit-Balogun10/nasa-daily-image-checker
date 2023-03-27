import type { Request, Response, NextFunction, } from "express";

export const errorHandler = (
    err: TypeError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
        error: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
