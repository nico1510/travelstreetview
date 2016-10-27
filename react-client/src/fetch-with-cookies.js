import 'whatwg-fetch';

const global = typeof self !== 'undefined' ? self : window;
const originalFetch = global.fetch;

export default function injectDefaultCookieStrategyForFetch(strategy) {
    global.fetch = (input, options) => {
        options = options || {};
        options.credentials = strategy;
        return originalFetch(input, options);
    }
}