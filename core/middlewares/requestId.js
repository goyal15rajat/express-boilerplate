const { v4: uuidv4 } = require('uuid')
const { AsyncLocalStorage } = require('async_hooks')


const asyncLocalStorage = new AsyncLocalStorage();

const requestIdMiddleware = (req, res, next) => {
    asyncLocalStorage.run(new Map(), () => {
        asyncLocalStorage.getStore().set("requestId", uuidv4());
        next();
    });
}

module.exports = {
    asyncLocalStorage,
    requestIdMiddleware,
}