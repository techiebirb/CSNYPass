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

  // extension/popup/welcome.js
  var import_webextension_polyfill = __toESM(require_browser_polyfill(), 1);

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
  function validateSettingsForSave(values) {
    const payload = normalizeSettings(values);
    if (!payload.email) {
      return { ok: false, error: "Enter your email address." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    return { ok: true, settings: payload };
  }
  var LOCK_MODES = {
    CUSTOM: "custom",
    SAME_AS_LOGIN: "same_as_login",
    BIOMETRIC: "biometric"
  };
  var UNLOCK_POLICIES = {
    ATTEMPT: "attempt",
    SESSION: "session",
    MINUTES: "minutes"
  };
  var DEFAULT_UNLOCK_POLICY = UNLOCK_POLICIES.SESSION;
  var DEFAULT_UNLOCK_MINUTES = 30;
  var MAX_UNLOCK_MINUTES = 1440;
  function normalizeUnlockPolicy(policy, minutes) {
    const valid = Object.values(UNLOCK_POLICIES);
    const normalizedPolicy = valid.includes(policy) ? policy : DEFAULT_UNLOCK_POLICY;
    const m = Math.round(Number(minutes));
    const normalizedMinutes = Number.isFinite(m) ? Math.min(MAX_UNLOCK_MINUTES, Math.max(1, m)) : DEFAULT_UNLOCK_MINUTES;
    return { policy: normalizedPolicy, minutes: normalizedMinutes };
  }
  var MIN_CUSTOM_LOCK_PASSWORD_LENGTH = 4;
  function validateLockSetup(input) {
    if (input?.mode === LOCK_MODES.BIOMETRIC) {
      return { ok: true, mode: LOCK_MODES.BIOMETRIC };
    }
    const mode = input?.mode === LOCK_MODES.SAME_AS_LOGIN ? LOCK_MODES.SAME_AS_LOGIN : LOCK_MODES.CUSTOM;
    if (mode === LOCK_MODES.SAME_AS_LOGIN) {
      const loginPassword = String(input?.loginPassword ?? "");
      if (!loginPassword.trim()) {
        return {
          ok: false,
          error: "Enter your OneLogin password, or choose a separate settings password."
        };
      }
      return { ok: true, mode };
    }
    const settingsPassword = String(input?.settingsPassword ?? "");
    const confirmPassword = String(input?.confirmPassword ?? "");
    if (!settingsPassword) {
      return { ok: false, error: "Enter a settings password." };
    }
    if (settingsPassword.length < MIN_CUSTOM_LOCK_PASSWORD_LENGTH) {
      return {
        ok: false,
        error: `Settings password must be at least ${MIN_CUSTOM_LOCK_PASSWORD_LENGTH} characters.`
      };
    }
    if (settingsPassword !== confirmPassword) {
      return { ok: false, error: "Settings passwords do not match." };
    }
    return { ok: true, mode };
  }

  // shared/lib/dom.js
  var CollegiateDom = /* @__PURE__ */ (() => {
    const LOG_PREFIX = "[CSNYPass]";
    function debug(...args) {
      console.debug(LOG_PREFIX, ...args);
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

  // shared/config/sites.js
  var BLACKBAUD_SIGN_IN_URL = "https://collegiateschool.myschoolapp.com/app";
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

  // shared/lib/bytes.js
  function bytesToBase64(bytes) {
    let bin = "";
    const chunk = 32768;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }
  function base64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function toUint8Array(bufferOrView) {
    if (bufferOrView instanceof Uint8Array) return bufferOrView;
    if (ArrayBuffer.isView(bufferOrView)) {
      return new Uint8Array(
        bufferOrView.buffer,
        bufferOrView.byteOffset,
        bufferOrView.byteLength
      );
    }
    return new Uint8Array(bufferOrView);
  }

  // shared/lib/webauthn.js
  var RP_NAME = "CSNYPass";
  var TIMEOUT_MS = 6e4;
  var BiometricError = class extends Error {
    /** @param {"unsupported" | "prf-unsupported" | "cancelled" | "failed"} code */
    constructor(code, message) {
      super(message);
      this.name = "BiometricError";
      this.code = code;
    }
  };
  async function isBiometricSupported() {
    try {
      if (!globalThis.PublicKeyCredential || !navigator.credentials) return false;
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
  function mapError(err) {
    if (err instanceof BiometricError) return err;
    if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
      return new BiometricError("cancelled", "Biometric prompt was cancelled or timed out.");
    }
    if (err?.name === "NotSupportedError" || err?.name === "SecurityError") {
      return new BiometricError(
        "unsupported",
        "This browser or device could not use Touch ID / Face ID here."
      );
    }
    return new BiometricError("failed", err?.message || "Biometric check failed.");
  }
  function prfFirst(results) {
    const first = results?.prf?.results?.first;
    return first ? toUint8Array(first) : null;
  }
  async function getPrfOutput(credential) {
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [
            {
              type: "public-key",
              id: base64ToBytes(credential.credentialId),
              ...credential.transports?.length ? { transports: credential.transports } : {}
            }
          ],
          userVerification: "required",
          timeout: TIMEOUT_MS,
          extensions: { prf: { eval: { first: base64ToBytes(credential.prfSalt) } } }
        }
      });
      const out = prfFirst(assertion.getClientExtensionResults());
      if (!out) {
        throw new BiometricError(
          "prf-unsupported",
          "This device did not return a biometric key (PRF unsupported)."
        );
      }
      return bytesToBase64(out);
    } catch (err) {
      throw mapError(err);
    }
  }
  async function createBiometricCredential() {
    if (!await isBiometricSupported()) {
      throw new BiometricError(
        "unsupported",
        "Touch ID / Face ID is not available on this device or browser."
      );
    }
    const prfSalt = crypto.getRandomValues(new Uint8Array(32));
    let credential;
    try {
      credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: RP_NAME },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: "collegiate-auto-sign-in",
            displayName: RP_NAME
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "discouraged"
          },
          attestation: "none",
          timeout: TIMEOUT_MS,
          extensions: { prf: { eval: { first: prfSalt } } }
        }
      });
    } catch (err) {
      throw mapError(err);
    }
    const results = credential.getClientExtensionResults();
    if (!results?.prf?.enabled && !results?.prf?.results) {
      throw new BiometricError(
        "prf-unsupported",
        "This browser or device can't use Touch ID / Face ID to protect saved data. Use Full auto instead."
      );
    }
    const transports = typeof credential.response?.getTransports === "function" ? credential.response.getTransports() : [];
    const info = {
      credentialId: bytesToBase64(toUint8Array(credential.rawId)),
      prfSalt: bytesToBase64(prfSalt),
      transports
    };
    const immediate = prfFirst(results);
    const prfOutput = immediate ? bytesToBase64(immediate) : await getPrfOutput(info);
    return { ...info, prfOutput };
  }

  // extension/popup/setup-form.js
  function setStatus(el, message, ok) {
    if (!el) return;
    el.textContent = message || "";
    el.className = "status" + (message ? ok ? " ok" : " err" : "");
  }
  function wirePasswordToggles() {
    document.querySelectorAll(".toggle-pw").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-target");
        const input = id ? document.querySelector(`#${id}`) : null;
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "Hide" : "Show";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }
  function clampDelayMs(ms) {
    const n = Number(ms);
    if (!Number.isFinite(n)) return DEFAULTS.clickDelayMs;
    return Math.min(5e3, Math.max(0, Math.round(n)));
  }
  function formatDelayLabel(ms) {
    const seconds = clampDelayMs(ms) / 1e3;
    return `${seconds.toFixed(1)} s`;
  }
  function setDelayMs(prefix, ms) {
    const value = clampDelayMs(ms);
    const slider = document.querySelector(`#${prefix}-clickDelaySlider`);
    const number = document.querySelector(`#${prefix}-clickDelayMs`);
    const label = document.querySelector(`#${prefix}-clickDelayLabel`);
    if (slider) slider.value = String(value);
    if (number) number.value = String(value);
    if (label) label.textContent = formatDelayLabel(value);
  }
  function wireDelayControls(prefix) {
    const slider = document.querySelector(`#${prefix}-clickDelaySlider`);
    const number = document.querySelector(`#${prefix}-clickDelayMs`);
    if (!slider || !number) return;
    slider.addEventListener("input", () => {
      setDelayMs(prefix, slider.value);
    });
    number.addEventListener("input", () => {
      setDelayMs(prefix, number.value);
    });
    number.addEventListener("change", () => {
      setDelayMs(prefix, number.value);
    });
  }
  function isBiometricSelected(prefix) {
    return document.querySelector(`#${prefix}-mode-bio`)?.checked === true;
  }
  function syncLockModeVisibility(prefix = "lock") {
    const bio = isBiometricSelected(prefix);
    const autoFields = document.querySelector(`#${prefix}-auto-fields`);
    const bioFields = document.querySelector(`#${prefix}-bio-fields`);
    if (autoFields) autoFields.hidden = bio;
    if (bioFields) bioFields.hidden = !bio;
    const sameAsLogin = document.querySelector(`#${prefix}-same-as-login`);
    const customFields = document.querySelector(`#${prefix}-custom-fields`);
    if (sameAsLogin && customFields) customFields.hidden = sameAsLogin.checked;
    const policy = document.querySelector(`#${prefix}-policy`)?.value;
    const minutesWrap = document.querySelector(`#${prefix}-minutes-wrap`);
    if (minutesWrap) minutesWrap.hidden = policy !== UNLOCK_POLICIES.MINUTES;
  }
  function applyBiometricAvailability(prefix, supported) {
    const option = document.querySelector(`#${prefix}-mode-bio-option`);
    const note = document.querySelector(`#${prefix}-bio-unsupported`);
    if (option) option.hidden = !supported;
    if (note) note.hidden = supported;
  }
  function readBiometricOptions(prefix) {
    return normalizeUnlockPolicy(
      document.querySelector(`#${prefix}-policy`)?.value,
      document.querySelector(`#${prefix}-minutes`)?.value
    );
  }
  function readLockConfig(prefix, loginPasswordValue) {
    if (isBiometricSelected(prefix)) {
      return { mode: LOCK_MODES.BIOMETRIC, ...readBiometricOptions(prefix) };
    }
    const sameAsLogin = document.querySelector(`#${prefix}-same-as-login`)?.checked;
    if (sameAsLogin) {
      return {
        mode: LOCK_MODES.SAME_AS_LOGIN,
        loginPassword: loginPasswordValue
      };
    }
    return {
      mode: LOCK_MODES.CUSTOM,
      settingsPassword: document.querySelector(`#${prefix}-password`)?.value ?? "",
      confirmPassword: document.querySelector(`#${prefix}-password-confirm`)?.value ?? "",
      loginPassword: loginPasswordValue
    };
  }
  function biometricErrorMessage(err) {
    if (err instanceof BiometricError) return err.message;
    return err && typeof err.message === "string" ? err.message : "Touch ID / Face ID failed.";
  }
  async function attachBiometricEnrollment(lockConfig) {
    const enrollment = await createBiometricCredential();
    return { ...lockConfig, enrollment };
  }
  function validateLockConfigForSetup(lockConfig, loginPassword) {
    if (lockConfig.mode === LOCK_MODES.BIOMETRIC) return { ok: true };
    return validateLockSetup({
      mode: lockConfig.mode,
      settingsPassword: lockConfig.settingsPassword,
      confirmPassword: lockConfig.confirmPassword,
      loginPassword
    });
  }

  // extension/popup/welcome.js
  var EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
  var ORDER = ["intro", "login", "protect", "done"];
  var PROGRESS_STEPS = ["login", "protect", "done"];
  var STEP_TITLES = {
    login: "Your school login",
    protect: "Keep it protected",
    done: "All set"
  };
  var CONFETTI_COLORS = ["#00306b", "#f5a623", "#6cb4ee", "#0a6b32", "#e86a92"];
  var CONFETTI_COUNT = 32;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var $ = (sel) => document.querySelector(sel);
  var stepsEl = $("#steps");
  var progressEl = $("#progress");
  var stepEls = Object.fromEntries(
    [...document.querySelectorAll("[data-step]")].map((el) => [el.dataset.step, el])
  );
  var currentStep = "intro";
  var transitioning = false;
  var migrationPending = false;
  var biometricSupported = false;
  var pendingSettings = null;
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function animateHeight(from, to) {
    if (reducedMotion() || from === to) return;
    stepsEl.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: 280,
      easing: EASE_OUT
    });
  }
  function withHeightChange(update) {
    const from = stepsEl.offsetHeight;
    update();
    animateHeight(from, stepsEl.offsetHeight);
  }
  function shake(el) {
    if (!el || reducedMotion()) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    el.addEventListener("animationend", () => el.classList.remove("shake"), { once: true });
  }
  function burstConfetti() {
    const host = $("#confetti");
    if (!host || reducedMotion()) return;
    host.replaceChildren();
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      const dist = 70 + Math.random() * 110;
      const span = document.createElement("span");
      if (Math.random() < 0.3) span.className = "round";
      span.style.setProperty("--c", CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      span.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      span.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      span.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
      span.style.setProperty("--delay", `${Math.random() * 120}ms`);
      host.append(span);
    }
    window.setTimeout(() => host.replaceChildren(), 1900);
  }
  function updateProgress(name) {
    const idx = PROGRESS_STEPS.indexOf(name);
    progressEl.hidden = idx === -1;
    if (idx === -1) return;
    const finished = name === "done";
    progressEl.style.setProperty("--p", String(finished ? 1 : idx / (PROGRESS_STEPS.length - 1)));
    [...progressEl.children].forEach((li, i) => {
      li.classList.toggle("is-done", finished || i < idx);
      li.classList.toggle("is-current", !finished && i === idx);
      if (i === idx && !finished) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
  }
  function settle(stepEl, name) {
    const target = stepEl.querySelector("[data-autofocus]") ?? stepEl.querySelector("h1");
    target?.focus({ preventScroll: true });
    const idx = PROGRESS_STEPS.indexOf(name);
    $("#step-announce").textContent = idx === -1 ? "" : `Step ${idx + 1} of ${PROGRESS_STEPS.length}: ${STEP_TITLES[name]}`;
  }
  async function showStep(name, { instant = false } = {}) {
    const next = stepEls[name];
    const cur = stepEls[currentStep];
    if (!next || transitioning || next === cur) return;
    updateProgress(name);
    if (instant || reducedMotion() || !cur || cur.hidden) {
      for (const el of Object.values(stepEls)) el.hidden = el !== next;
      currentStep = name;
      settle(next, name);
      return;
    }
    transitioning = true;
    const dir = ORDER.indexOf(name) >= ORDER.indexOf(currentStep) ? 1 : -1;
    const fromHeight = stepsEl.offsetHeight;
    try {
      await cur.animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: `translateX(${-24 * dir}px)` }
        ],
        { duration: 160, easing: "ease-in", fill: "forwards" }
      ).finished;
    } catch {
    }
    cur.getAnimations().forEach((a) => a.cancel());
    cur.hidden = true;
    next.hidden = false;
    animateHeight(fromHeight, stepsEl.offsetHeight);
    next.animate(
      [
        { opacity: 0, transform: `translateX(${24 * dir}px)` },
        { opacity: 1, transform: "none" }
      ],
      { duration: 280, easing: EASE_OUT }
    );
    currentStep = name;
    transitioning = false;
    settle(next, name);
  }
  function readLoginPayload() {
    return {
      enabled: true,
      email: $("#cas-email").value.trim(),
      password: $("#cas-password").value,
      autoClickNext: $("#cas-autoClickNext").checked,
      clickDelayMs: $("#cas-clickDelayMs").value
    };
  }
  function showEmailError(message) {
    const el = $("#email-error");
    el.textContent = message;
    if (message) shake($("#cas-email"));
  }
  function handleLoginSubmit(e) {
    e.preventDefault();
    const validation = validateSettingsForSave(readLoginPayload());
    if (!validation.ok) {
      showEmailError(validation.error);
      $("#cas-email").focus();
      return;
    }
    showEmailError("");
    pendingSettings = validation.settings;
    showStep("protect");
  }
  function setFinishBusy(busy) {
    const button = $("#btn-finish");
    button.disabled = busy;
    button.classList.toggle("is-busy", busy);
  }
  function protectError(message) {
    const el = $("#protect-status");
    setStatus(el, message, false);
    shake(el);
  }
  async function handleProtectSubmit(e) {
    e.preventDefault();
    const statusEl = $("#protect-status");
    setStatus(statusEl, "", false);
    const loginPassword = pendingSettings?.password ?? "";
    let lockConfig = readLockConfig("lock", loginPassword);
    if (!migrationPending || lockConfig.mode === LOCK_MODES.CUSTOM) {
      const lockValidation = validateLockConfigForSetup(lockConfig, loginPassword);
      if (!lockValidation.ok) {
        protectError(lockValidation.error);
        return;
      }
    }
    setFinishBusy(true);
    if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
      setStatus(statusEl, "Waiting for Touch ID / Face ID\u2026", true);
      statusEl.classList.add("waiting");
      try {
        lockConfig = await attachBiometricEnrollment(lockConfig);
      } catch (err) {
        protectError(biometricErrorMessage(err));
        setFinishBusy(false);
        return;
      }
    }
    let result;
    try {
      result = await import_webextension_polyfill.default.runtime.sendMessage({
        type: "SAVE_SETTINGS",
        settings: migrationPending ? null : pendingSettings,
        lock: lockConfig,
        migration: migrationPending
      });
    } catch (err) {
      protectError(err && typeof err.message === "string" ? err.message : "Could not save settings.");
      setFinishBusy(false);
      return;
    }
    setFinishBusy(false);
    if (!result?.ok) {
      protectError(result?.error || "Could not save settings.");
      return;
    }
    const autoClick = pendingSettings ? pendingSettings.autoClickNext : null;
    finishSetup(lockConfig.mode, autoClick);
  }
  function describeSetup(mode, autoClick) {
    const protection = mode === LOCK_MODES.BIOMETRIC ? "Touch ID / Face ID" : "Full auto";
    if (autoClick === null) return protection;
    return `${protection} \xB7 Auto-click ${autoClick ? "on" : "off"}`;
  }
  function finishSetup(mode, autoClick, { celebrate = true } = {}) {
    for (const id of ["#cas-email", "#cas-password", "#lock-password", "#lock-password-confirm"]) {
      const el = $(id);
      if (el) el.value = "";
    }
    pendingSettings = null;
    $("#done-chip").textContent = describeSetup(mode, autoClick);
    showStep("done", { instant: !celebrate }).then(() => {
      if (celebrate) window.setTimeout(burstConfetti, 650);
    });
  }
  function wireLockControls() {
    const ids = ["lock-mode-auto", "lock-mode-bio", "lock-same-as-login", "lock-policy"];
    for (const id of ids) {
      $(`#${id}`)?.addEventListener("change", () => {
        withHeightChange(() => syncLockModeVisibility("lock"));
      });
    }
    applyBiometricAvailability("lock", biometricSupported);
    syncLockModeVisibility("lock");
  }
  function wireEmailValidity() {
    const input = $("#cas-email");
    const wrap = input.closest(".email-wrap");
    input.addEventListener("input", () => {
      wrap.classList.toggle("is-valid", EMAIL_RE.test(input.value.trim()));
      if ($("#email-error").textContent) showEmailError("");
    });
  }
  function openSettings() {
    import_webextension_polyfill.default.runtime.openOptionsPage().catch(() => {
    });
  }
  async function init() {
    wirePasswordToggles();
    wireDelayControls("cas");
    setDelayMs("cas", 300);
    biometricSupported = await isBiometricSupported();
    wireLockControls();
    wireEmailValidity();
    $("#btn-start").addEventListener("click", () => showStep("login"));
    $("#form-login").addEventListener("submit", handleLoginSubmit);
    $("#form-protect").addEventListener("submit", handleProtectSubmit);
    $("#form-login [data-back]").addEventListener("click", () => showStep("intro"));
    $("#form-protect [data-back]").addEventListener("click", () => showStep("login"));
    $("#btn-open-settings").addEventListener("click", openSettings);
    $("#btn-note-settings").addEventListener("click", openSettings);
    $("#btn-open-signin").href = BLACKBAUD_SIGN_IN_URL;
    let state;
    try {
      state = await import_webextension_polyfill.default.runtime.sendMessage({ type: "GET_POPUP_STATE" });
    } catch {
      state = { ok: false };
    }
    if (state?.ok && state.settingsCorrupt) {
      showStep("note", { instant: true });
      return;
    }
    if (state?.ok && state.migrationPending) {
      migrationPending = true;
      $("#migration-banner").hidden = false;
      $("#protect-title").textContent = "One more step";
      $("#protect-lead").textContent = "Choose how to protect your settings.";
      $("#btn-protect-back").hidden = true;
      $("#lock-same-as-login").checked = state.suggestSameAsLoginLock === true;
      syncLockModeVisibility("lock");
      showStep("protect", { instant: true });
      return;
    }
    if (state?.ok && state.configured) {
      $("#done-title").textContent = "You're already set up";
      $("#done-lead").textContent = "CSNYPass is filling your sign-in steps.";
      finishSetup(state.lockMode, null, { celebrate: false });
      return;
    }
    $("#btn-start").focus({ preventScroll: true });
  }
  init();
})();
//# sourceMappingURL=welcome.js.map
