import 'whatwg-fetch';

const global = typeof self !== 'undefined' ? self : window;
const originalFetch = global.fetch;

export default function injectDefaultCookiePolicyForFetch(policy) {
    global.fetch = (input, options) => {
        options = options || {};
        options.credentials = options.credentials || policy;
        return originalFetch(input, options);
    }
}