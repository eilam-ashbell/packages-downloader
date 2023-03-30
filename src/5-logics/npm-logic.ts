import npmService from "../7-services/npm-service";
import path from "path";
import fs from "fs";
import { ZipResponse } from "../4-models/zip-response";

function zipPackagesReqursivly(
  packageName: string,
  options: { recursive: boolean }
): ZipResponse {
  try {
    // if (options.recursive == false) {
      const zipPath = npmService.packageToZip(packageName, options);
      const zipData = fs.readFileSync(zipPath);
      const zipName = path.basename(zipPath);
      const zipRes = new ZipResponse(zipName, zipPath, zipData);
      return zipRes;
    // }
  } catch (err: any) {
    console.log(err);
  }
}

export default {
  zipPackagesReqursivly,
  // zipPackage,
};
