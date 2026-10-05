(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.deno/webextension-polyfill@0.12.0/node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/.deno/webextension-polyfill@0.12.0/node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // extension/content/index.js
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill(), 1);

  // shared/settings-schema.js
  var DEFAULTS = {
    enabled: true,
    email: "",
    password: "",
    autoClickNext: true,
    clickDelayMs: 300
  };
  function normalizeSettings(raw) {
    const merged = { ...DEFAULTS, ...raw && typeof raw === "object" ? raw : {} };
    merged.enabled = merged.enabled !== false;
    merged.email = String(merged.email || "").trim();
    merged.password = String(merged.password || "");
    merged.autoClickNext = merged.autoClickNext !== false;
    const delay = Number(merged.clickDelayMs);
    merged.clickDelayMs = Number.isFinite(delay) ? Math.max(0, Math.min(5e3, delay)) : DEFAULTS.clickDelayMs;
    return merged;
  }
  var UNLOCK_POLICIES = {
    ATTEMPT: "attempt",
    SESSION: "session",
    MINUTES: "minutes"
  };
  var DEFAULT_UNLOCK_POLICY = UNLOCK_POLICIES.SESSION;

  // extension/content/automation.js
  var import_webextension_polyfill = __toESM(require_browser_polyfill(), 1);

  // shared/lib/dom.js
  var CollegiateDom = /* @__PURE__ */ (() => {
    const LOG_PREFIX2 = "[CSNYPass]";
    function debug(...args) {
      console.debug(LOG_PREFIX2, ...args);
    }
    function queryFirst(selectors, root = document) {
      for (const selector of selectors) {
        try {
          const el = root.querySelector(selector);
          if (el) return el;
        } catch {
        }
      }
      return null;
    }
    function isVisible(el) {
      if (!el || !(el instanceof HTMLElement)) return false;
      if (el.hidden) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      return el.offsetParent !== null || style.position === "fixed";
    }
    function setNativeInputValue(input, value) {
      const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
      if (descriptor?.set) {
        descriptor.set.call(input, value);
      } else {
        input.value = value;
      }
    }
    function fillInput(input, value) {
      if (!input || input.disabled || input.readOnly) return false;
      input.focus();
      setNativeInputValue(input, "");
      setNativeInputValue(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return input.value === value;
    }
    function findNextButton(selectors) {
      const bySelector = queryFirst(selectors);
      if (bySelector && isVisible(bySelector) && !bySelector.disabled) {
        return bySelector;
      }
      const candidates = document.querySelectorAll(
        'button, input[type="submit"], input[type="button"]'
      );
      const labelRe = /^(next|continue)$/i;
      for (const el of candidates) {
        if (!isVisible(el) || el.disabled) continue;
        const text = (el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
        if (labelRe.test(text)) return el;
      }
      return bySelector;
    }
    function waitFor(conditionFn, timeoutMs = 15e3, pollMs = 100) {
      return new Promise((resolve) => {
        const start = Date.now();
        let observer;
        let interval;
        const finish = (value) => {
          if (observer) observer.disconnect();
          clearInterval(interval);
          resolve(value);
          return true;
        };
        const tryResolve = () => {
          const result = conditionFn();
          if (result) return finish(result);
          if (Date.now() - start >= timeoutMs) return finish(null);
          return false;
        };
        if (tryResolve()) return;
        observer = new MutationObserver(() => {
          tryResolve();
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true
        });
        interval = setInterval(tryResolve, pollMs);
      });
    }
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
    async function clickWhenReady(button, delayMs) {
      if (!button) return false;
      if (delayMs > 0) await sleep(delayMs);
      if (button.disabled || !isVisible(button)) return false;
      button.click();
      return true;
    }
    return {
      debug,
      queryFirst,
      isVisible,
      fillInput,
      findNextButton,
      waitFor,
      clickWhenReady
    };
  })();

  // shared/lib/attempts.js
  var MAX_AUTO_SUBMITS = 2;
  var SUBMIT_WINDOW_MS = 5 * 60 * 1e3;
  function readTimes(storage, key, now, windowMs) {
    try {
      const parsed = JSON.parse(storage.getItem(key) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((t) => typeof t === "number" && now - t < windowMs);
    } catch {
      return [];
    }
  }
  function canAutoSubmit(storage, key, { max = MAX_AUTO_SUBMITS, windowMs = SUBMIT_WINDOW_MS, now = Date.now() } = {}) {
    return readTimes(storage, key, now, windowMs).length < max;
  }
  function recordAutoSubmit(storage, key, { windowMs = SUBMIT_WINDOW_MS, now = Date.now() } = {}) {
    try {
      const times = readTimes(storage, key, now, windowMs);
      times.push(now);
      storage.setItem(key, JSON.stringify(times));
    } catch {
    }
  }
  function isDifferentAccount(existingValue, savedEmail) {
    const existing = String(existingValue || "").trim();
    if (!existing) return false;
    return existing.toLowerCase() !== String(savedEmail || "").trim().toLowerCase();
  }

  // shared/config/sites.js
  function findLabeledButton(labelRe) {
    for (const el of document.querySelectorAll(
      'button, input[type="submit"], input[type="button"]'
    )) {
      if (!CollegiateDom.isVisible(el) || el.disabled) continue;
      const text = (el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
      if (labelRe.test(text)) return el;
    }
    return null;
  }
  function createBlackbaudSiteConfig(id, hostPattern) {
    return {
      id,
      runFlow: "blackbaudEmail",
      hostPattern,
      pathPattern: /\/app/i,
      emailSelectors: ["#Username"],
      nextSelectors: ["#nextBtn", 'input[type="submit"][value="Next"]'],
      /**
       * The whole /app area is the signed-in site, so the URL can't tell us. Only the
       * Blackbaud sign-in form (email box + Next, no password box) counts.
       */
      isSignInPage() {
        const username = document.getElementById("Username");
        const next = document.getElementById("nextBtn");
        const password = document.getElementById("Password");
        return CollegiateDom.isVisible(username) && CollegiateDom.isVisible(next) && !CollegiateDom.isVisible(password);
      },
      isEmailStep() {
        const password = document.getElementById("Password");
        if (!password) return true;
        return password.offsetParent === null;
      }
    };
  }
  var COLLEGIATE_SITE_CONFIGS = [
    createBlackbaudSiteConfig(
      "collegiate-school-nyc",
      /^collegiateschool\.myschoolapp\.com$/i
    ),
    {
      id: "blackbaud-app-signin",
      runFlow: "blackbaudSsoPick",
      hostPattern: /^app\.blackbaud\.com$/i,
      pathPattern: /\/signin/i,
      ssoButtonLabel: /Collegiate School/i,
      isSignInPage() {
        return findLabeledButton(this.ssoButtonLabel) !== null;
      }
    },
    {
      id: "csny-onelogin",
      runFlow: "oneLogin",
      hostPattern: /^csny\.onelogin\.com$/i,
      pathPattern: /\/login2?(?:\/|\?|#|$)/i,
      usernameSelectors: ["#username", 'input[name="username"]'],
      passwordSelectors: ["#password", 'input[name="password"]'],
      submitSelectors: ['button[type="submit"]'],
      isSignInPage() {
        return this.getStep() !== null;
      },
      getStep() {
        const password = CollegiateDom.queryFirst(this.passwordSelectors);
        if (password && CollegiateDom.isVisible(password)) return "password";
        const username = CollegiateDom.queryFirst(this.usernameSelectors);
        if (username && CollegiateDom.isVisible(username)) return "username";
        return null;
      }
    }
  ];
  function getSiteConfigForLocation(location) {
    const host = location.hostname;
    const href = location.href;
    for (const config of COLLEGIATE_SITE_CONFIGS) {
      if (!config.hostPattern.test(host)) continue;
      if (config.pathPattern && !config.pathPattern.test(href)) continue;
      return config;
    }
    return null;
  }

  // extension/content/automation.js
  var SESSION_PREFIX = "collegiateAutoSignIn";
  var ATTEMPTS_PREFIX = "collegiateAutoSignIn.attempts";
  var LOG_PREFIX = "[CSNYPass]";
  var currentSettings = null;
  var automationChain = Promise.resolve();
  var domWatchStarted = false;
  var domDebounceTimer;
  var lastAutomationHref = "";
  var refreshSettingsFn = null;
  function stepGuardKey(siteId, step) {
    return `${SESSION_PREFIX}/${siteId}/${step}`;
  }
  function isStepDone(siteId, step) {
    try {
      return sessionStorage.getItem(stepGuardKey(siteId, step)) === "1";
    } catch {
      return false;
    }
  }
  function markStepDone(siteId, step) {
    try {
      sessionStorage.setItem(stepGuardKey(siteId, step), "1");
    } catch {
    }
  }
  function clearStepDone(siteId, step) {
    try {
      sessionStorage.removeItem(stepGuardKey(siteId, step));
    } catch {
    }
  }
  function attemptsKey(siteId, step) {
    return `${ATTEMPTS_PREFIX}/${siteId}/${step}`;
  }
  function autoSubmitAllowed(site, step) {
    try {
      if (canAutoSubmit(sessionStorage, attemptsKey(site.id, step))) return true;
    } catch {
      return true;
    }
    CollegiateDom.debug(`Stopped auto-submitting the ${step} step after repeated attempts`);
    return false;
  }
  function noteAutoSubmit(site, step) {
    try {
      recordAutoSubmit(sessionStorage, attemptsKey(site.id, step));
    } catch {
    }
  }
  function clearAllSessionGuards() {
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(`${SESSION_PREFIX}/`)) keys.push(key);
      }
      for (const key of keys) sessionStorage.removeItem(key);
    } catch {
    }
  }
  function shouldSkipBlackbaudEmailStep(site) {
    if (!isStepDone(site.id, "email")) return false;
    if (!site.isEmailStep || !site.isEmailStep()) return true;
    const emailInput = CollegiateDom.queryFirst(site.emailSelectors);
    const empty = !emailInput || !(emailInput.value || "").trim();
    if (empty) {
      clearStepDone(site.id, "email");
      return false;
    }
    return true;
  }
  async function runBlackbaudSsoPickStep(settings, site) {
    if (!settings.autoClickNext) return;
    const labelRe = site.ssoButtonLabel || /Collegiate School/i;
    if (isStepDone(site.id, "sso")) {
      const stillThere = findLabeledButton(labelRe);
      if (stillThere) clearStepDone(site.id, "sso");
      else return;
    }
    const ssoButton = await CollegiateDom.waitFor(() => {
      const btn = findLabeledButton(labelRe);
      if (btn && !btn.disabled) return btn;
      return null;
    });
    if (!ssoButton) {
      CollegiateDom.debug("Collegiate School SSO button not found in time");
      return;
    }
    const clicked = await CollegiateDom.clickWhenReady(
      ssoButton,
      Number(settings.clickDelayMs) || 0
    );
    if (clicked) {
      CollegiateDom.debug("Clicked Collegiate School (Blackbaud sign-in)");
      markStepDone(site.id, "sso");
    } else {
      CollegiateDom.debug("Collegiate School SSO button not clicked");
    }
  }
  function shouldSkipOneLoginUsernameStep(site) {
    if (!isStepDone(site.id, "username")) return false;
    const usernameInput = CollegiateDom.queryFirst(site.usernameSelectors);
    if (usernameInput && CollegiateDom.isVisible(usernameInput) && !(usernameInput.value || "").trim()) {
      clearStepDone(site.id, "username");
      return false;
    }
    return true;
  }
  function shouldSkipOneLoginPasswordStep(site) {
    if (!isStepDone(site.id, "password")) return false;
    const passwordInput = CollegiateDom.queryFirst(site.passwordSelectors);
    if (passwordInput && CollegiateDom.isVisible(passwordInput) && !(passwordInput.value || "").trim()) {
      clearStepDone(site.id, "password");
      return false;
    }
    return true;
  }
  async function runBlackbaudEmailStep(settings, site) {
    if (shouldSkipBlackbaudEmailStep(site)) return;
    if (site.isEmailStep && !site.isEmailStep()) {
      CollegiateDom.debug("Not on email step; skipping");
      return;
    }
    const emailInput = await CollegiateDom.waitFor(() => {
      const el = CollegiateDom.queryFirst(site.emailSelectors);
      if (el && CollegiateDom.isVisible(el)) return el;
      return null;
    });
    if (!emailInput) {
      CollegiateDom.debug("Email field not found in time");
      return;
    }
    const targetEmail = settings.email.trim();
    const existing = (emailInput.value || "").trim();
    if (!existing) {
      const filled = CollegiateDom.fillInput(emailInput, targetEmail);
      if (!filled) {
        CollegiateDom.debug("Could not set email value");
        return;
      }
      CollegiateDom.debug("Email filled");
    } else if (existing.toLowerCase() !== targetEmail.toLowerCase()) {
      CollegiateDom.debug("Email field has different value; skipping fill");
    } else {
      CollegiateDom.debug("Email already filled");
    }
    if (!settings.autoClickNext) {
      markStepDone(site.id, "email");
      return;
    }
    const nextButton = await CollegiateDom.waitFor(() => {
      const btn = CollegiateDom.findNextButton(site.nextSelectors);
      if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
      return null;
    }, 5e3);
    const clicked = await CollegiateDom.clickWhenReady(
      nextButton,
      Number(settings.clickDelayMs) || 0
    );
    if (clicked) {
      CollegiateDom.debug("Clicked Next");
      markStepDone(site.id, "email");
    } else {
      CollegiateDom.debug("Next button not clicked (missing or disabled)");
    }
  }
  async function clickSubmit(site, settings) {
    const submitButton = await CollegiateDom.waitFor(() => {
      const btn = CollegiateDom.findNextButton(site.submitSelectors);
      if (btn && CollegiateDom.isVisible(btn) && !btn.disabled) return btn;
      return null;
    }, 5e3);
    return CollegiateDom.clickWhenReady(
      submitButton,
      Number(settings.clickDelayMs) || 0
    );
  }
  async function runOneLoginUsernameStep(settings, site) {
    if (shouldSkipOneLoginUsernameStep(site)) return true;
    const onUsername = await CollegiateDom.waitFor(() => {
      if (site.getStep() === "username") return true;
      if (site.getStep() === "password") return "skip";
      return null;
    });
    if (onUsername === "skip") {
      CollegiateDom.debug("Already on password step; skipping username");
      markStepDone(site.id, "username");
      return true;
    }
    if (!onUsername) {
      CollegiateDom.debug("Username step not found in time");
      return false;
    }
    const usernameInput = CollegiateDom.queryFirst(site.usernameSelectors);
    if (!usernameInput || !CollegiateDom.isVisible(usernameInput)) {
      CollegiateDom.debug("Username field not visible");
      return false;
    }
    const existing = (usernameInput.value || "").trim();
    if (isDifferentAccount(existing, settings.email)) {
      CollegiateDom.debug("Username field has a different account; leaving it alone");
      return false;
    }
    if (!existing) {
      const filled = CollegiateDom.fillInput(usernameInput, settings.email.trim());
      if (!filled) {
        CollegiateDom.debug("Could not set username");
        return false;
      }
      CollegiateDom.debug("Username filled");
    } else {
      CollegiateDom.debug("Username already filled; skipping fill");
    }
    if (!settings.autoClickNext) {
      markStepDone(site.id, "username");
      return true;
    }
    if (!autoSubmitAllowed(site, "username")) return false;
    const clicked = await clickSubmit(site, settings);
    if (clicked) {
      noteAutoSubmit(site, "username");
      CollegiateDom.debug("Clicked Continue (username step)");
      markStepDone(site.id, "username");
      return true;
    }
    CollegiateDom.debug("Continue not clicked on username step");
    return false;
  }
  async function requestPasswordUnlock(site) {
    if (isStepDone(site.id, "unlockRequested")) return;
    const onPassword = await CollegiateDom.waitFor(
      () => site.getStep() === "password" ? true : null
    );
    if (!onPassword) return;
    markStepDone(site.id, "unlockRequested");
    import_webextension_polyfill.default.runtime.sendMessage({ type: "REQUEST_SIGN_IN_UNLOCK" }).catch(() => {
    });
  }
  async function runOneLoginPasswordStep(settings, site) {
    if (shouldSkipOneLoginPasswordStep(site)) return true;
    if (!settings.password?.trim()) {
      if (settings.passwordLocked) await requestPasswordUnlock(site);
      else CollegiateDom.debug("No OneLogin password saved; skipping password step");
      return false;
    }
    const passwordInput = await CollegiateDom.waitFor(() => {
      if (site.getStep() !== "password") return null;
      const el = CollegiateDom.queryFirst(site.passwordSelectors);
      if (el && CollegiateDom.isVisible(el)) return el;
      return null;
    });
    if (!passwordInput) {
      CollegiateDom.debug("Password field not found in time");
      return false;
    }
    const existing = (passwordInput.value || "").trim();
    if (!existing) {
      if (settings.autoClickNext && !autoSubmitAllowed(site, "password")) return false;
      const filled = CollegiateDom.fillInput(passwordInput, settings.password);
      if (!filled) {
        CollegiateDom.debug("Could not set password");
        return false;
      }
      CollegiateDom.debug("Password filled");
    } else {
      CollegiateDom.debug("Password field already has value; skipping fill");
    }
    if (!settings.autoClickNext) {
      markStepDone(site.id, "password");
      return true;
    }
    if (!autoSubmitAllowed(site, "password")) return false;
    const clicked = await clickSubmit(site, settings);
    if (clicked) {
      noteAutoSubmit(site, "password");
      CollegiateDom.debug("Clicked Continue (password step)");
      markStepDone(site.id, "password");
      return true;
    }
    CollegiateDom.debug("Continue not clicked on password step");
    return false;
  }
  function reportSignInFinished() {
    import_webextension_polyfill.default.runtime.sendMessage({ type: "FLOW_DONE" }).catch(() => {
    });
  }
  async function runOneLoginFlow(settings, site) {
    const usernameDone = await runOneLoginUsernameStep(settings, site);
    const passwordDone = await runOneLoginPasswordStep(settings, site);
    const hasPassword = Boolean(settings.password?.trim()) || settings.passwordLocked === true;
    if (hasPassword ? passwordDone : usernameDone) reportSignInFinished();
  }
  async function runAutomation() {
    const site = getSiteConfigForLocation(window.location);
    if (!site) {
      CollegiateDom.debug("No site config for", window.location.hostname);
      return;
    }
    if (!site.isSignInPage()) return;
    if (!currentSettings?.email?.trim() && refreshSettingsFn) {
      const refreshed = await refreshSettingsFn();
      if (refreshed) currentSettings = refreshed;
    }
    if (site.runFlow === "blackbaudSsoPick" && currentSettings?.profileUnavailable) {
      await runBlackbaudSsoPickStep(normalizeSettings({}), site);
      return;
    }
    const settings = currentSettings;
    if (!settings?.enabled || !settings.email?.trim()) return;
    if (site.runFlow === "oneLogin") {
      await runOneLoginFlow(settings, site);
      return;
    }
    if (site.runFlow === "blackbaudSsoPick") {
      await runBlackbaudSsoPickStep(settings, site);
      return;
    }
    if (site.runFlow === "blackbaudEmail" || site.emailSelectors) {
      await runBlackbaudEmailStep(settings, site);
    }
  }
  function scheduleAutomation() {
    automationChain = automationChain.then(() => runAutomation()).catch((err) => {
      console.debug(LOG_PREFIX, err);
    });
  }
  function setAutomationSettings(settings) {
    currentSettings = settings;
  }
  function noteHrefChangeAndMaybeClearGuards() {
    const href = window.location.href;
    if (href === lastAutomationHref) return;
    const prev = lastAutomationHref;
    lastAutomationHref = href;
    if (!prev) return;
    try {
      const next = new URL(href);
      const prior = new URL(prev);
      if (next.origin !== prior.origin || next.pathname !== prior.pathname || next.search !== prior.search) {
        clearAllSessionGuards();
      }
    } catch {
      clearAllSessionGuards();
    }
  }
  function onNavigationLikeActivity() {
    noteHrefChangeAndMaybeClearGuards();
    scheduleAutomation();
  }
  function patchHistoryMethod(methodName) {
    const original = history[methodName];
    if (typeof original !== "function") return;
    history[methodName] = function(...args) {
      const result = original.apply(this, args);
      onNavigationLikeActivity();
      return result;
    };
  }
  function startDomWatch() {
    if (domWatchStarted) return;
    domWatchStarted = true;
    lastAutomationHref = window.location.href;
    window.addEventListener("hashchange", onNavigationLikeActivity);
    window.addEventListener("popstate", onNavigationLikeActivity);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) clearAllSessionGuards();
      onNavigationLikeActivity();
    });
    patchHistoryMethod("pushState");
    patchHistoryMethod("replaceState");
    const observer = new MutationObserver(() => {
      clearTimeout(domDebounceTimer);
      domDebounceTimer = setTimeout(onNavigationLikeActivity, 300);
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  function notifyNavigationCompleted() {
    clearAllSessionGuards();
    lastAutomationHref = "";
    onNavigationLikeActivity();
  }
  function runAutomationAfterSettingsChange(settings) {
    clearAllSessionGuards();
    currentSettings = settings;
    const run = () => scheduleAutomation();
    run();
    setTimeout(run, 900);
  }
  function startAutomationEngine(initialSettings, options = {}) {
    currentSettings = initialSettings;
    refreshSettingsFn = typeof options.refreshSettings === "function" ? options.refreshSettings : null;
    scheduleAutomation();
    startDomWatch();
  }

  // extension/content/index.js
  var settingsCache = normalizeSettings({});
  var awaitingProfile = false;
  var unlockRequested = false;
  async function fetchSettingsFromBackground() {
    try {
      const response = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "GET_SETTINGS" });
      if (response?.locked) {
        awaitingProfile = true;
        settingsCache = normalizeSettings({ ...settingsCache, profileUnavailable: true });
        if (response.needsProfile && !unlockRequested && window.location.hostname === "csny.onelogin.com") {
          unlockRequested = true;
          import_webextension_polyfill2.default.runtime.sendMessage({ type: "REQUEST_SIGN_IN_UNLOCK" }).catch(() => {
          });
        }
        return settingsCache;
      }
      if (response?.ok && response.settings) {
        awaitingProfile = false;
        settingsCache = normalizeSettings({
          ...response.settings,
          passwordLocked: response.passwordLocked === true
        });
        return settingsCache;
      }
    } catch (err) {
      console.debug("[CSNYPass]", err);
    }
    return settingsCache;
  }
  async function fetchSettingsWithRetry(maxAttempts = 6) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const settings = await fetchSettingsFromBackground();
      if (settings?.email?.trim() || awaitingProfile) {
        return settings;
      }
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
      }
    }
    return settingsCache;
  }
  function dropPassword() {
    settingsCache = normalizeSettings({
      ...settingsCache,
      password: "",
      passwordLocked: settingsCache.hasPassword === true
    });
    setAutomationSettings(settingsCache);
  }
  import_webextension_polyfill2.default.runtime.onMessage.addListener((message) => {
    if (message?.type === "SETTINGS_LOCKED") {
      dropPassword();
      fetchSettingsFromBackground().then(setAutomationSettings);
    }
    if (message?.type === "SETTINGS_CHANGED") {
      awaitingProfile = false;
      fetchSettingsFromBackground().then((settings) => {
        runAutomationAfterSettingsChange(settings);
      });
    }
    if (message?.type === "NAVIGATION_COMPLETED") {
      notifyNavigationCompleted();
    }
  });
  startAutomationEngine(null, {
    refreshSettings: () => awaitingProfile ? Promise.resolve(settingsCache) : fetchSettingsWithRetry()
  });
})();
//# sourceMappingURL=content.js.map
