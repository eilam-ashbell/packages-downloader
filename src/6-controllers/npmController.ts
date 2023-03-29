import express, { NextFunction, Request, Response } from "express";
import npmService from "../7-services/npm-service";
import * as fs from "fs";
import path from "path";
import safeDelete from "../2-utils/safe-delete";
import config from "../2-utils/config";

const router = express.Router();

// Download npm package & dependencies
router.get(
    "/api/npm/:packageName",
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const packageName: string = request.params.packageName;
            const zipPath = npmService.npmInstall(packageName);
            const zipData = fs.readFileSync(zipPath);
            const zipName = path.basename(zipPath)
            // Set headers to indicate that the response is a zip file
            response.setHeader("Content-Type", "application/zip");
            response.setHeader(
                "Content-Disposition",
                `attachment; filename=${zipName}`
            );
            // Send the file as a response
            response.send(zipData);
            safeDelete(zipPath)
            // safeDelete(path.join(config.logDir, (packageName + '.log')))
        } catch (err: any) {
            next(err);
        }
    }
);

export default router;
