import npmService from "./services/npm-service";
import setupService from "./services/setup-service";

const packageName = "random";
npmService.npmInstall(packageName);

// setupService.deleteSetupFolders()