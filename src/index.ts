import config from "../config";
import logService from "./services/log-service";
import npmService from "./services/npm-service";
import zipService from "./services/zip-service";
/**
 * Recursively installs and packs an npm package and its dependencies.
 * @param packageName The name of the npm package to install and pack.
 */

const packageName = "random";
function npmInstall(mainPackage: string) {
    logService.dependenciesList.add(mainPackage);
    logService.createLogFiles(mainPackage);
    logService.addLog(mainPackage, "started process");
    npmService.installAndPackRecursively(mainPackage, mainPackage);
    logService.addLog(mainPackage, `DONE!`);
    logService.addLog(
        mainPackage,
        `total of ${
            logService.dependenciesList.size
        } packages: [${[...logService.dependenciesList].sort()}]`
    );
    logService.addLog(
        mainPackage,
        `packed: ${
            logService.packedList.size
        } packages: [${[...logService.packedList].sort()}]`
    );
    logService.addLog(
        mainPackage,
        `not packed: ${
            logService.notPackedList.size
        } packages: [${[...logService.notPackedList].sort()}]`
    );
    logService.addLog(mainPackage, `zipping all packages...`);
    zipService.packFolderAsZip(config.tarballDir, mainPackage)
}

npmInstall(packageName);


