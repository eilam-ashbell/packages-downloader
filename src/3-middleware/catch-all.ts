import { NextFunction, Request, Response } from "express";
import config from "../2-utils/config";

function catchAll(
    err: any,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    if (config.devMode) {
        // Log error to console:
        console.log(err);

        // Get status code:
        const statusCode = err.status ? err.status : 500;

        // Return error to frontend:
        response.status(statusCode).send(err.message);
    } else {
        // Get status code:
        const statusCode = err.status ? err.status : 500;

        // Return error to frontend:
        response
            .status(statusCode)
            .send("It's looks like there was an error.. Please try again");
    }
}

export default catchAll;
