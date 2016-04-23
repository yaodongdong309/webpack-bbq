/* eslint strict:0 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var askForDevTools = void 0;
if (process.env.NODE_ENV === 'development') {
  askForDevTools = function askForDevTools(createStore) {
    // If we're in Chrome or Firefox, provide a download link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
      console.debug('Download the Redux DevTools for a better development experience: ' + 'https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en');
    }
    return createStore;
  };
} else {
  askForDevTools = function askForDevTools(createStore) {
    return createStore;
  };
}

exports.default = askForDevTools;
module.exports = exports['default'];
