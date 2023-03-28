import logService from "./services/log-service";
import npmService from "./services/npm-service";

/**
 * Recursively installs and packs an npm package and its dependencies.
 * @param packageName The name of the npm package to install and pack.
 */

const packageName = "express";
function npmInstall(mainPackage: string) {
    logService.dependenciesList.add(mainPackage);
    logService.createLogFiles(mainPackage);
    logService.addLog(mainPackage, "started process");
    installAndPackRecursively(mainPackage, mainPackage);
    logService.addLog(mainPackage, `DONE!`);
    logService.addLog(
        mainPackage,
        `total of ${
            logService.dependenciesList.size
        } packages: [${[...logService.dependenciesList]}]`
    );
    logService.addLog(
        mainPackage,
        `packed: ${
            logService.packedList.size
        } packages: [${[...logService.packedList]}]`
    );
    logService.addLog(
        mainPackage,
        `not packed: ${
            logService.notPackedList.size
        } packages: [${[...logService.notPackedList]}]`
    );
}

npmInstall(packageName);

function installAndPackRecursively(
    packageName: string,
    mainPackage?: string
): void {
    logService.dependenciesList.add(packageName);
    npmService.installPackage(packageName, mainPackage);
    const packageDependencies = npmService.getDependencies(
        packageName,
        mainPackage
    );
    for (const dep of packageDependencies) {
        installAndPackRecursively(dep, mainPackage);
    }
    npmService.createTarball(packageName, mainPackage);
    npmService.uninstallPackage(packageName, mainPackage);
}
