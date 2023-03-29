
import config from "../2-utils/config";
import * as fs from "fs";
import fsExtra from "fs-extra"

function setupDirectories(): void {
    if (!fs.existsSync(config.logDir)) {
        fs.mkdirSync(config.logDir, {recursive: true})
    }
    if (!fs.existsSync(config.tarballDir)) {
        fs.mkdirSync(config.tarballDir, {recursive: true})
    }
    if (!fs.existsSync(config.zipDir)) {
        fs.mkdirSync(config.zipDir, {recursive: true})
    }
}

function deleteSetupFolders(): void {
    fsExtra.removeSync(config.logDir)
    fsExtra.removeSync(config.tarballDir)
    fsExtra.removeSync(config.zipDir)
}

export default {
    setupDirectories,
    deleteSetupFolders
}