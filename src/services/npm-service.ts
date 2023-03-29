import { execSync } from "child_process";
import config from "../../config";
import * as fs from "fs";
import * as path from "path";
import logService from "./log-service";

function installAndPackRecursively(
    packageName: string,
    mainPackage?: string
): void {
    logService.dependenciesList.add(packageName);
    installPackage(packageName, mainPackage);
    const packageDependencies = getDependencies(
        packageName,
        mainPackage
    );
    for (const dep of packageDependencies) {
        installAndPackRecursively(dep, mainPackage);
    }
    createTarball(packageName, mainPackage);
    uninstallPackage(packageName, mainPackage);
}

function installPackage(packageName: string, parentPackage: string): void {
    logService.addLog(
        parentPackage,
        `installing ${packageName}`
        );
    const packageDir = config.packagesDir + packageName;
    // check if the package is already installed
    if (fs.existsSync(packageDir)) {
        logService.addLog(
            parentPackage,
            `package ${packageName} already installed.`
        );
    } else {
        // if not exist - install the package
        try {
            execSync(`npm install ${packageName}`);
            logService.installedList.add(packageName);
            logService.addLog(
                parentPackage,
                `${packageName} installed`
                );
        } catch (err) {
            logService.uninstalledList.add(packageName);
            logService.addLog(parentPackage, `${err}`);
        }
    }
}

function getDependencies(packageName: string, parentPackage: string): string[] {
    try {
        const packageDir = config.packagesDir + packageName;
        // read package.json of the package
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(packageDir, "package.json"), "utf8")
        );
        // read dependencies of the package
        const dependencies = Object.keys(packageJson.dependencies || {});
        if (dependencies.length > 0) {
            logService.addLog(
                parentPackage,
                `${packageName} dependencies: ${dependencies}`
            );
        } else {
            logService.addLog(parentPackage, `no dependencies found for ${packageName}`);
        }
        return dependencies;
    } catch (err) {
        logService.addLog(parentPackage, `${err}`);
    }
}

function getPackageVersion(packageName: string): string {
    const packageDir = config.packagesDir + packageName;
    // read package.json of the package
    const packageJson = JSON.parse(
        fs.readFileSync(path.join(packageDir, "package.json"), "utf8")
    );
    // read dependencies of the package
    const version = packageJson['version']
    logService.packageVersion.push(version)
    return version
}

function createTarball(packageName: string, parentPackage: string): void {
    // define a path for the tarball file
    const packageDir = config.packagesDir + packageName;
    const tarballPath = path.resolve(
        "packages",
        `${packageName}-${
            require(`${config.packagesDir + packageName}/package.json`).version
        }.tgz`
    );
    // check if a tarball file is already exist for that package
    if (fs.existsSync(tarballPath)) {
        logService.addLog(
            parentPackage,
            `tarball for ${packageName} already exists.`
        );
    } else {
        try {
            logService.addLog(parentPackage, `packing ${packageName}`);
            // pack the package
            execSync(`npm pack ${packageDir}`, { stdio: "inherit" });
            // move the tarball to its path
            fs.renameSync(
                `${packageName}-${
                    require(`${packageDir}/package.json`).version
                }.tgz`,
                tarballPath
            );
            logService.packedList.add(packageName)
        } catch (err) {
            logService.addLog(parentPackage, `${err}`);
            logService.notPackedList.add(packageName)

        }
    }
}

function uninstallPackage(packageName: string, parentPackage: string): void {
    try {
        // uninstall the package
        execSync(`npm uninstall ${packageName}`);
        logService.addLog(parentPackage, `${packageName} deleted`);
    } catch (err) {
        logService.addLog(parentPackage, `${err}`);
    }
}

export default {
    installAndPackRecursively,
    installPackage,
    getDependencies,
    getPackageVersion,
    createTarball,
    uninstallPackage,
};
