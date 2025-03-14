import app from "./src/app.js";
import http from "http"
import config from "./src/config/config.js";
import connectToDB from "./src/db/db.js"

connectToDB()
const server  = http.createServer(app)
const PORT = config.PORT;
server.listen(PORT,()=>{
    console.log("server is running on the port 3000")
})