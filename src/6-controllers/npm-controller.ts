import express, { NextFunction, Request, Response } from "express";
import npmLogic from "../5-logics/npm-logic";

const router = express.Router();

// Download npm package & dependencies reqursivly
router.get(
  "/api/npm/:packageName",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      // get package name from request
      const packageName: string = request.params.packageName;
      const recursive: boolean = JSON.parse(request.query.recursive);
      // create zip file & data with all required packages
      const zip = npmLogic.zipPackagesReqursivly(packageName, {
        recursive: recursive,
      });
      // set response headers for zip sending
      response.setHeader("Content-Type", "application/zip");
      response.setHeader(
        "Content-Disposition",
        `attachment; filename=${zip.name}`
      );
      // Send the file as a response
      response.send(zip.data);

      // // delete zip file from backend
      // safeDelete(zip.path)
      // // delete log file from backend
      // safeDelete(path.join(config.logDir, (packageName + '.log')))
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
