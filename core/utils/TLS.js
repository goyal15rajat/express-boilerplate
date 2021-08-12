/*
    Async Local Storage aka TLS
    https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage

    Usage:
        Import the state wherever needed
            const state = import('path/to/TLS.js')

        Set values in the state
            state.set(key, value)

        Get values from the state
            const value = state.get(key)

    Troubleshooting:
        https://nodejs.org/api/async_hooks.html#async_hooks_troubleshooting

        Multer:
            https://theekshanawj.medium.com/nodejs-using-multer-and-cls-hooked-together-a00decbebab6
*/
const { AsyncLocalStorage } = require('async_hooks')

const state = new AsyncLocalStorage()

state.get = (key) => {
    /*
        Get value of a key from the state

        Args:
            key: any key

        Returns:
            value of the key, if any
            or
            undefined if store does not exist, for conditions where code is not run inside a context
    */
    let store = state.getStore()
    if (!store) return undefined
    return store[key]
}

state.set = (key, value) => {
    /*
        Set value of a key to the state

        Args:
            key: any key
            value: any value
    */
    state.getStore()[key] = value
}

module.exports = state