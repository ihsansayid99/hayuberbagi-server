const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

module.exports = {
    rootPath: path.resolve(__dirname, '..'),
    serviceName: process.env.SERVICE_NAME,
    urlDb: process.env.MONGO_URL,
    portEnv: process.env.PORT,
    secretJwt: process.env.SECRET_JWT
}