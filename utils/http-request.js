const axios = require('axios').default
const { v4: uuid } = require('uuid')
const FormData = require('form-data')
const log = require('./logger')
const { InternalServerError, GatewayTimeout } = require('./http-error')

const SETTINGS = require('../settings/common')

async function makeRequest({
    url, method, params, headers, data, timeout = 20, files, requestId
}) {
    /*
        Make external request to a URL using axios
        Args:
            url: URL of the request.
            method: method of the request.
            params: (optional) Object to be sent in the query string.
            headers: (optional) Object of HTTP Headers to send.
            data: (optional) Object to send in the body.
            timeout: (optional) How many seconds to wait for the server to send data.
            files: (optional) A FormData object
            requestId: (optional) ID of the request to be sent. ex. uuid()

        Returns:
            An Object containing response of the request, binary format and HTTP code of the response and
            message of the error in making request (if any).
    */
    if (files instanceof FormData) {
        // Make everything part of FormData
        for (let [key, value] of Object.entries(data)) {
            files.append(key, value)
        }
        data = files
        headers = {
            ...headers,
            ...data.getHeaders()
        }
    }

    let res, resData, resCode, error;
    requestId = requestId || uuid()

    const options = {
        url,
        method,
        params,
        headers,
        data,
        timeout: timeout * 1000,
    }

    log.logApp({
        level: 'info',
        message: 'API_REQUEST',
        meta: {
            logType: 'APP',
            requestPath: url,
            requestMethod: method,
            requestDict: options,
            requestId,
        }
    })

    try {
        const reqTimestamp = +new Date()
        res = await axios(options)
        const resTimestamp = +new Date()

        log.logApp({
            level: 'info',
            message: 'API_RESPONSE',
            meta: {
                logType: 'APP',
                responseCode: res.status,
                responseTime: resTimestamp - reqTimestamp,
                responseContent: Math.floor(res.status / 100) !== 2 || SETTINGS.ENV === "DEVELOPMENT" ? res.data : {},
                requestId,
            }
        })

        resData = res.data
        resCode = res.status
    }
    catch (err) {
        if (err.code === 'ECONNABORTED') {
            log.logApp({
                level: 'error',
                message: 'API_TIMEOUT_ERROR',
                error: err
            })
            throw new GatewayTimeout({})
        }
        else if (err.response && err.response.status) {
            const httpError = require('./http-error')[err.response.status]
            log.logApp({
                level: 'error',
                message: 'API_ERROR',
                error: err
            })
            throw new httpError({})
        }
        else {
            log.logApp({
                level: 'error',
                message: 'API_ERROR',
                error: err
            })
            throw new InternalServerError({})
        }
    }

    return { res, resData, resCode, error }
}

module.exports = {
    makeRequest,
}