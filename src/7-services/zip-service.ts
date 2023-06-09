import fs from "fs";
import path from "path";
import Zip from "node-zip";
import config from "../2-utils/config";
import npmService from "./npm-service";

function packFolderAsZip(folderPath: string, mainPackage: string): string {
    const zip = new Zip();
    const packageVersion = npmService.getPackageVersion(mainPackage)

    // Call the function to add files to the zip object
    addFilesToZip(zip, folderPath, "");

    // Add log file to zip
    const logPath = `${config.logDir}/${mainPackage}.log`;
    const logData = fs.readFileSync(logPath);
    zip.file(`${mainPackage}.log`, logData);

    // Generate the zip file data
    const zipData = zip.generate({ type: "nodebuffer" });
    const zipPath = path.join(
        config.zipDir,
        `${mainPackage}-${packageVersion}.zip`
    );

    // Write the zip file data to a file
    fs.writeFileSync(zipPath, zipData);
    return zipPath
}

// Recursively add files to the zip object
function addFilesToZip(zip, folderPath, relativePath): void {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        const entryPath = path.join(relativePath, file);

        if (stats.isDirectory()) {
            addFilesToZip(zip, filePath, entryPath);
        } else {
            const fileData = fs.readFileSync(filePath);
            zip.file(entryPath, fileData);
        }
    });
}

export default {
    packFolderAsZip,
    addFilesToZip,
};
