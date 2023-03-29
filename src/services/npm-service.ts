import { execSync } from "child_process";
import config from "../../config";
import * as fs from "fs";
import path from "path";
import logService from "./log-service";
import zipService from "./zip-service";
import setupService from "./setup-service";

function installAndPackRecursively(packageName: string): void {
    logService.packageData.totalPackages.add(packageName);
    installPackage(packageName);
    const packageDependencies = getPackageDependencies(packageName);
    for (const dep of packageDependencies) {
        installAndPackRecursively(dep);
    }
    createTarball(packageName);
}

function installPackage(packageName: string): void {
    logService.logMsg(
        logService.packageData.logFilePath,
        `🔍 getting '${packageName}'`
    );
    const packageDir = path.join(config.packagesDir, packageName);
    // check if the package is already installed
    if (fs.existsSync(packageDir)) {
        logService.logMsg(
            logService.packageData.logFilePath,
            `✅ package already installed`
        );
    } else {
        // if not exist - install the package
        try {
            logService.logMsg(
                logService.packageData.logFilePath,
                `⬇️ installing ${packageName}`
            );
            execSync(`npm install ${packageName}`);
            logService.packageData.installedPackages.add(packageName);
            logService.logMsg(
                logService.packageData.logFilePath,
                `✅ ${packageName} installed`
            );
        } catch (err) {
            logService.packageData.notInstalledPackages.add(packageName);
            logService.logMsg(logService.packageData.logFilePath, `❗️ ${err}`);
        }
    }
}

function getPackageDependencies(packageName: string): string[] {
    try {
        logService.logMsg(
            logService.packageData.logFilePath,
            `🔍 getting dependencies for ${packageName}`
        );
        const packageJsonPath = path.join(
            config.packagesDir,
            packageName,
            "package.json"
        );
        // read package.json of the package
        const packageJsonData = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
        );
        // read dependencies of the package
        const dependencies = Object.keys(packageJsonData.dependencies || {});
        if (dependencies.length > 0) {
            logService.logMsg(
                logService.packageData.logFilePath,
                `📋 dependencies: ${dependencies.sort()}`
            );
        } else {
            logService.logMsg(
                logService.packageData.logFilePath,
                `no dependencies found`
            );
        }
        return dependencies;
    } catch (err) {
        logService.logMsg(logService.packageData.logFilePath, `${err}`);
    }
}

function getPackageVersion(packageName: string): string {
    const packageJsonPath = path.join(
        config.packagesDir,
        packageName,
        "package.json"
    );
    // read package.json of the package
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    // read dependencies of the package
    const packageVersion = packageJson["version"];
    logService.packageData.packageVersion = packageVersion;
    return packageVersion;
}

function createTarball(packageName: string): void {
    const packageVersion = getPackageVersion(packageName)
    // define a path for the tarball file
    const packageDir = config.packagesDir + packageName;
    const tarballPath = path.join(
        config.tarballDir,
        `${packageName}-${packageVersion}.tgz`
    );
    // check if a tarball file is already exist for that package
    if (fs.existsSync(tarballPath)) {
        logService.logMsg(
            logService.packageData.logFilePath,
            `✅ ${packageName} tarball already exists`
        );
        logService.packageData.packedPackages.add(packageName);
    } else {
        try {
            logService.logMsg(
                logService.packageData.logFilePath,
                `📦 packing ${packageName}`
            );
            // pack the package
            execSync(`npm pack ${packageDir}`, { stdio: "inherit" });
            // move the tarball to its path
            fs.renameSync(
                `${packageName}-${logService.packageData.packageVersion}.tgz`,
                tarballPath
            );
            logService.packageData.packedPackages.add(packageName);
            logService.logMsg(
                logService.packageData.logFilePath,
                `✅ ${packageName} packed`
            );
        } catch (err) {
            logService.logMsg(logService.packageData.logFilePath, `❗️ ${err}`);
            logService.packageData.notPackedPackages.add(packageName);
        }
    }
}

function deletePackage(packageName: string): void {
    try {
        logService.logMsg(
            logService.packageData.logFilePath,
            `🗑 deleting ${packageName}`
        );
        // uninstall the package
        execSync(`npm uninstall ${packageName}`);
        logService.logMsg(
            logService.packageData.logFilePath,
            `✅ ${packageName} deleted`
        );
    } catch (err) {
        logService.logMsg(logService.packageData.logFilePath, `❗️ ${err}`);
    }
}

function npmInstall(mainPackage: string) {
    setupService.setupDirectories();
    logService.packageData.logFilePath = logService.createLogFile(mainPackage);
    logService.logDivider(logService.packageData.logFilePath);
    logService.packageData.totalPackages.add(mainPackage);
    logService.logMsg(logService.packageData.logFilePath, "process started");
    installAndPackRecursively(mainPackage);
    logService.logDivider(logService.packageData.logFilePath);
    logService.logMsg(
        logService.packageData.logFilePath,
        `total of ${logService.packageData.totalPackages.size} packages: [${[
            ...logService.packageData.totalPackages,
        ].sort()}]`
    );
    logService.logMsg(
        logService.packageData.logFilePath,
        `packed: ${logService.packageData.packedPackages.size} packages: [${[
            ...logService.packageData.packedPackages,
        ].sort()}]`
    );
    logService.logMsg(
        logService.packageData.logFilePath,
        `not packed: ${
            logService.packageData.notPackedPackages.size
        } packages: [${[...logService.packageData.notPackedPackages].sort()}]`
    );
    logService.logMsg(
        logService.packageData.logFilePath,
        `zipping all packages`
    );
    logService.logDivider(logService.packageData.logFilePath);
    zipService.packFolderAsZip(config.tarballDir, mainPackage);
    logService.packageData.installedPackages.forEach((p) =>
        deletePackage(p)
    );
}

export default {
    npmInstall,
    installAndPackRecursively,
    installPackage,
    getPackageDependencies,
    getPackageVersion,
    createTarball,
    deletePackage,
};
