import config from "../../config";
import * as fs from "fs";

const dependenciesList: Set<string> = new Set()
const installedList: Set<string> = new Set()
const packedList: Set<string> = new Set()
const notPackedList: Set<string> = new Set()
const uninstalledList: Set<string> = new Set()

function createLogFiles(packageName: string): void {
    const logFolder = `${config.logDir}`
    const logPath = `${config.logDir}/${packageName}.log`
    // const packageTreePath = `${config.logDir}/${packageName}/${packageName}.json`
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logFolder, {recursive: true})
        fs.writeFileSync(logPath, "")
        // const jsonFile = `{"${packageName}": "undefine"}`
        // fs.writeFileSync(packageTreePath, jsonFile)
    }
}

function addLog(mainPackage: string, msg: string): void {
    const logPath = `${config.logDir}/${mainPackage}.log`
    const timeStamp = new Date().toISOString();
    fs.appendFileSync(logPath, timeStamp + '\t' + msg + '\n')
}


export default {
    addLog,
    createLogFiles,
    dependenciesList,
    installedList,
    packedList,
    notPackedList,
    uninstalledList
}