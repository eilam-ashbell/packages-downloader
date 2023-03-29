import config from "../2-utils/config";
import * as fs from "fs";

const packageData = {
    totalPackages: new Set<string>(),
    installedPackages: new Set<string>(),
    notInstalledPackages: new Set<string>(),
    packedPackages: new Set<string>(),
    notPackedPackages: new Set<string>(),
    packageVersion: undefined,
    logFilePath: undefined,
};

function createLogFile(packageName: string): string {
    const logFolder = `${config.logDir}`;
    const logFilePath = `${config.logDir}/${packageName}.log`;
    if (!fs.existsSync(logFilePath)) {
        fs.mkdirSync(logFolder, { recursive: true });
        fs.writeFileSync(logFilePath, "");
    }
    return logFilePath;
}

function logMsg(logFilePath: string, msg: string): void {
    const timeStamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, timeStamp + "\t" + msg + "\n");
}
function logDivider(logFilePath: string): void {
    fs.appendFileSync(
        logFilePath,
        "------------------------------------------------- \n"
    );
}

export default {
    logMsg,
    logDivider,
    createLogFile,
    packageData,
};
