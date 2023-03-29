import express from "express"
import cors from "cors";
import expressFileUpload from "express-fileupload";

import npmService from "./7-services/npm-service";
import setupService from "./7-services/setup-service";
import routeNotFound from "./3-middleware/route-not-found";
import sanitize from "./3-middleware/sanitize";
import catchAll from "./3-middleware/catch-all";
import npmController from "./6-controllers/npmController";

const packageName = "random";
// npmService.npmInstall(packageName);

setupService.deleteSetupFolders()


// Create server object
const server = express();

// // Securing DoS attacks
// server.use("/api/", expressRateLimit({
//     windowMs: 100, // Window time
//     max: 1, // Max request per window time
//     message: "Too many requests" // Message to alert when detecting more then max requests over window time
// }))

// Allow cors
server.use(cors());

// Read the body json object
server.use(express.json());

server.use('/static',express.static(__dirname + '/1-assets'))

// Sanitize tags from requests
server.use(sanitize)

// Handle files
server.use(expressFileUpload())

// Routes requests to controllers
server.use("/", npmController);

// Route not found
server.use("*", routeNotFound);

// Catch all middleware
server.use(catchAll);

server.listen(process.env.PORT || 3000, () => console.log(`Listening on port: ${process.env.PORT || 3000}`));
