/*
    Winston with extended functionality

    exposes 3 extra functions:
        - logRequest(req, extra)
        - logResponse(req, res, extra)
        - logApp(extra)

    Requires TLS state and hence, must be used only if the application is running in the context,
    see middlwares.setContext for more information
*/
const winston = require('winston')
const path = require('path')
const {v4 : uuidv4} = require('uuid')
const request_id_middleware = require('../core/middlewares/requestId')
const SETTINGS = require('../core/settings/common')


let state = require('../utils/TLS')

const logVersion = 1

const createLogger = (params, extra) => {
    let log = winston.createLogger(params);
    log.logRequest = (req, extra) => { logRequest(log, req, extra) }
    log.logResponse = (req, res, extra) => { logResponse(log, req, res, extra) }
    log.logApp = (extra) => { logApp(log, extra) }
    return log;
}

function getStackInfo() {
    /*
        Get Information of the Call stack

        Args:
            Nothing

        Returns:
            Array of objects, where each object has the following keys
            { functionName, fileName, lineNumber }

            First entry represents the top of the call stack
            Last entry represents the bottom of the call stack
    */
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    let err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    let stack = err.stack;
    Error.prepareStackTrace = orig;
    let info = []
    for (let call of stack)
        info.push({
            functionName: call.getFunctionName(),
            fileName: call.getFileName(),
            lineNumber: call.getLineNumber(),
        })
    return info
}

const logRequest = (log, req, extra) => {
    /*
        Logs a request object

        Args:
            log: winston logger
            req: request object
            extra: any extra data as an object

        Returns:
            Nothing
    */
    let data = {}
    let message = ''
    let level = 'info'

    if (extra && typeof extra === "object") {
        if ('message' in extra) {
            message = extra['message']
            delete extra['message']
        }
        if ('level' in extra) {
            level = extra['level']
            delete extra['level']
        }
    }

    const stackInfo = getStackInfo()

    // stackInfo[0] contains my info
    // stackInfo[1] contains addUtils's info
    // stackInfo[2] contains the actual caller

    if (request_id_middleware.asyncLocalStorage.getStore()) {

    }

    data = {
        logVersion,
        level,
        logType: "REQUEST",
        requestId: request_id_middleware.asyncLocalStorage && request_id_middleware.asyncLocalStorage.getStore() ? request_id_middleware.asyncLocalStorage.getStore().get('requestId') : NaN,
        processId: process.pid,
        processName: process.title,
        message: "REQUEST",
        module: stackInfo[2]['functionName'],
        name: stackInfo[0]['functionName'],
        timestamp: new Date(),
        pathName: stackInfo[2]['fileName'],
        fileName: path.basename(stackInfo[2]['fileName']),
        funcName: stackInfo[2]['functionName'],
        lineNumber: stackInfo[2]['lineNumber'],
        threadId: '',
        threadName: '',
        error: "",
        service: SETTINGS.SERVICE_NAME,
        ...extra,
        userId: "Check response for user id",
        requestPath: req.baseUrl + req.path,
        requestMethod: req.method,
        requestRouteName: req.baseUrl + req.path,
        requestQueryParams: req.query,
        requestParams: req.params,
        requestHost: req.hostname,
        requestBody: req.body,
        requestToken: req.get('authorization'), // if no header is present
        requestUserAgent: req.get('User-Agent'),
        requestClientAddr: req.ip,
        requestHeaders: req.headers,
        // Other fields
    }
    log.log(data)
}

const logResponse = (log, req, res, extra) => {
    /*
        Logs a response object

        Args:
            log: winston logger
            req: request object
            res: response object
            extra: any extra data as an object

        Returns:
            Nothing
    */
    let data = {}
    let message = ''
    let level = 'info'

    if (extra && typeof extra === "object") {
        if ('message' in extra) {
            message = extra['message']
            delete extra['message']
        }
        if ('level' in extra) {
            level = extra['level']
            delete extra['level']
        }
    }

    const stackInfo = getStackInfo()
    // stackInfo[0] contains my info
    // stackInfo[1] contains addUtils's info
    // stackInfo[2] contains the actual caller

    data = {
        logVersion,
        level,
        logType: "RESPONSE",
        requestId: request_id_middleware.asyncLocalStorage && request_id_middleware.asyncLocalStorage.getStore() ? request_id_middleware.asyncLocalStorage.getStore().get('requestId') : NaN,
        processId: process.pid,
        processName: process.title,
        message: "RESPONSE",
        module: stackInfo[2]['functionName'],
        name: stackInfo[0]['functionName'],
        timestamp: new Date(),
        pathName: stackInfo[2]['fileName'],
        fileName: path.basename(stackInfo[2]['fileName']),
        funcName: stackInfo[2]['functionName'],
        lineNumber: stackInfo[2]['lineNumber'],
        threadId: '',
        threadName: '',
        error: "",
        service: SETTINGS.SERVICE_NAME,
        ...extra,
        userId: "User info not available",
        responseStatusCode: res.statusCode,
        responseTime: new Date() - req.timestamp,
        responseByteSize: res.get('content-length'),
        cacheUsed: "No cache",
        responseHeaders: req.headers,
    }
    log.log(data)
}

const logApp = (log, extra) => {
    /*
        Logs App activity

        Args:
            log: winston logger
            extra: any extra data as an object

        Returns:
            Nothing
    */
    let data = {}
    let message = ''
    let level = 'info'

    if (extra && typeof extra === "object") {
        if ('message' in extra) {
            message = extra['message']
            delete extra['message']
        }
        if ('level' in extra) {
            level = extra['level']
            delete extra['level']
        }
    }
    const stackInfo = getStackInfo()
    // stackInfo[0] contains my info
    // stackInfo[1] contains addUtils's info
    // stackInfo[2] contains the actual caller

    data = {
        logVersion,
        level,
        logType: "APP",
        requestId: request_id_middleware.asyncLocalStorage && request_id_middleware.asyncLocalStorage.getStore() ? request_id_middleware.asyncLocalStorage.getStore().get('requestId') : NaN,
        processId: process.pid,
        processName: process.title,
        message,
        module: stackInfo[2]['functionName'],
        name: stackInfo[0]['functionName'],
        timestamp: new Date(),
        pathName: stackInfo[2]['fileName'],
        fileName: path.basename(stackInfo[2]['fileName']),
        funcName: stackInfo[2]['functionName'],
        lineNumber: stackInfo[2]['lineNumber'],
        threadId: '',
        threadName: '',
        error: "",
        service: SETTINGS.SERVICE_NAME,
        ...extra,
    }
    log.log(data)
}

const logger = createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

module.exports = logger