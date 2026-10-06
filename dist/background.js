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

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
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

  // extension/background/index.js
  var import_webextension_polyfill6 = __toESM(require_browser_polyfill(), 1);

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

  // extension/background/storage-crypto.js
  var import_webextension_polyfill3 = __toESM(require_browser_polyfill(), 1);

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

  // shared/lib/vault.js
  var ENVELOPE_VERSION = 2;
  var SETTINGS_AAD = "csny.settings.v2";
  var DEK_WRAP_AAD = "csny.dekwrap.v1";
  var KEK_SALT = "csny.kek.salt.v1";
  var KEK_INFO = "csny.kek.v1";
  var IV_BYTES = 12;
  var enc = new TextEncoder();
  function isValidEnvelope(envelope) {
    return Boolean(
      envelope && typeof envelope === "object" && (envelope.v === 1 || envelope.v === ENVELOPE_VERSION) && typeof envelope.iv === "string" && envelope.iv && typeof envelope.ct === "string" && envelope.ct
    );
  }
  function generateDek({ extractable = false } = {}) {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, extractable, [
      "encrypt",
      "decrypt"
    ]);
  }
  function importDekRaw(rawBytes, { extractable = false } = {}) {
    return crypto.subtle.importKey(
      "raw",
      rawBytes,
      { name: "AES-GCM", length: 256 },
      extractable,
      ["encrypt", "decrypt"]
    );
  }
  function importDekJwk(jwk, { extractable = false } = {}) {
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "AES-GCM", length: 256 },
      extractable,
      ["encrypt", "decrypt"]
    );
  }
  async function encryptJson(key, value) {
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const ct = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: enc.encode(SETTINGS_AAD) },
      key,
      enc.encode(JSON.stringify(value))
    );
    return {
      v: ENVELOPE_VERSION,
      iv: bytesToBase64(iv),
      ct: bytesToBase64(new Uint8Array(ct))
    };
  }
  async function decryptJson(key, envelope) {
    if (!isValidEnvelope(envelope)) throw new Error("invalid envelope");
    const params = { name: "AES-GCM", iv: base64ToBytes(envelope.iv) };
    if (envelope.v === ENVELOPE_VERSION) {
      params.additionalData = enc.encode(SETTINGS_AAD);
    }
    const plain = await crypto.subtle.decrypt(params, key, base64ToBytes(envelope.ct));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  async function deriveKekFromPrf(prfBytes) {
    const base = await crypto.subtle.importKey(
      "raw",
      toUint8Array(prfBytes),
      "HKDF",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: enc.encode(KEK_SALT),
        info: enc.encode(KEK_INFO)
      },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  async function wrapDek(kek, dek) {
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", dek));
    const wrapped = await wrapRawDek(kek, raw);
    return { raw, wrapped };
  }
  async function wrapRawDek(kek, rawBytes) {
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const ct = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: enc.encode(DEK_WRAP_AAD) },
      kek,
      rawBytes
    );
    return { iv: bytesToBase64(iv), ct: bytesToBase64(new Uint8Array(ct)) };
  }
  async function unwrapRawDek(kek, wrapped) {
    if (!wrapped?.iv || !wrapped?.ct) throw new Error("invalid wrapped key");
    const raw = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(wrapped.iv),
        additionalData: enc.encode(DEK_WRAP_AAD)
      },
      kek,
      base64ToBytes(wrapped.ct)
    );
    return new Uint8Array(raw);
  }

  // extension/background/idb-keystore.js
  var DB_NAME = "csnyExtension.keystore";
  var STORE = "keys";
  var DEK_ID = "dek";
  var PROFILE_KEY_ID = "profileKey";
  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function withStore(mode, run) {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = run(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(request?.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }
  function idbGetDek() {
    return withStore("readonly", (s) => s.get(DEK_ID));
  }
  function idbPutDek(key) {
    return withStore("readwrite", (s) => s.put(key, DEK_ID));
  }
  function idbDeleteDek() {
    return withStore("readwrite", (s) => s.delete(DEK_ID));
  }
  function idbGetProfileKey() {
    return withStore("readonly", (s) => s.get(PROFILE_KEY_ID));
  }
  function idbPutProfileKey(key) {
    return withStore("readwrite", (s) => s.put(key, PROFILE_KEY_ID));
  }
  function idbDeleteProfileKey() {
    return withStore("readwrite", (s) => s.delete(PROFILE_KEY_ID));
  }

  // extension/background/lock-meta.js
  var import_webextension_polyfill = __toESM(require_browser_polyfill(), 1);
  var LOCK_STORAGE_KEY = "csnyExtension.lock.v1";
  async function loadLockMeta() {
    const stored = await import_webextension_polyfill.default.storage.local.get(LOCK_STORAGE_KEY);
    const raw = stored[LOCK_STORAGE_KEY];
    if (!raw || typeof raw !== "object") return null;
    return raw;
  }
  async function saveLockMeta(meta) {
    await import_webextension_polyfill.default.storage.local.set({ [LOCK_STORAGE_KEY]: meta });
  }
  async function isLockConfigured() {
    const meta = await loadLockMeta();
    return meta?.configured === true;
  }
  async function getLockMode() {
    const meta = await loadLockMeta();
    if (!meta?.configured) return null;
    if (meta.mode === LOCK_MODES.SAME_AS_LOGIN || meta.mode === LOCK_MODES.CUSTOM || meta.mode === LOCK_MODES.BIOMETRIC) {
      return meta.mode;
    }
    return null;
  }

  // extension/background/session-store.js
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill(), 1);
  var fallback = /* @__PURE__ */ new Map();
  function area() {
    return import_webextension_polyfill2.default.storage?.session ?? globalThis.chrome?.storage?.session ?? null;
  }
  async function sessionGet(key) {
    const store = area();
    if (!store) return fallback.get(key);
    const result = await store.get(key);
    return result?.[key];
  }
  async function sessionSet(key, value) {
    const store = area();
    if (!store) {
      fallback.set(key, value);
      return;
    }
    await store.set({ [key]: value });
  }
  async function sessionRemove(key) {
    const store = area();
    if (!store) {
      fallback.delete(key);
      return;
    }
    await store.remove(key);
  }

  // extension/background/storage-crypto.js
  var DEK_STORAGE_KEY = "csnyExtension.dek.v1";
  var SETTINGS_STORAGE_KEY = "csnyExtension.settings.v1";
  var PROFILE_STORAGE_KEY = "csnyExtension.profile.v1";
  var DEK_CACHE_KEY = "csnyExtension.dekCache.v1";
  var RELOCK_ALARM = "csny-relock";
  var ATTEMPT_WINDOW_MS = 3 * 60 * 1e3;
  var SETTINGS_ONLY_WINDOW_MS = 30 * 60 * 1e3;
  async function cacheBiometricDek(rawBytes, policy, minutes, { forSignIn = true } = {}) {
    let expiresAt = null;
    if (!forSignIn) {
      expiresAt = Date.now() + SETTINGS_ONLY_WINDOW_MS;
    } else if (policy === UNLOCK_POLICIES.ATTEMPT) {
      expiresAt = Date.now() + ATTEMPT_WINDOW_MS;
    } else if (policy === UNLOCK_POLICIES.MINUTES) {
      expiresAt = Date.now() + minutes * 6e4;
    }
    await sessionSet(DEK_CACHE_KEY, {
      raw: bytesToBase64(rawBytes),
      policy,
      forSignIn,
      expiresAt
    });
    try {
      await import_webextension_polyfill3.default.alarms?.clear(RELOCK_ALARM);
      if (expiresAt) await import_webextension_polyfill3.default.alarms?.create(RELOCK_ALARM, { when: expiresAt });
    } catch {
    }
  }
  async function clearDekCache() {
    await sessionRemove(DEK_CACHE_KEY);
    try {
      await import_webextension_polyfill3.default.alarms?.clear(RELOCK_ALARM);
    } catch {
    }
  }
  async function readDekCache() {
    const record = await sessionGet(DEK_CACHE_KEY);
    if (!record?.raw) return null;
    if (record.expiresAt && Date.now() > record.expiresAt) {
      await clearDekCache();
      return null;
    }
    return {
      raw: base64ToBytes(record.raw),
      policy: record.policy,
      forSignIn: record.forSignIn !== false
    };
  }
  var autoDekCreation = null;
  async function getOrCreateAutoDek() {
    autoDekCreation ??= (async () => {
      const existing = await idbGetDek();
      if (existing) return existing;
      const stored = await import_webextension_polyfill3.default.storage.local.get(DEK_STORAGE_KEY);
      const legacyJwk = stored[DEK_STORAGE_KEY];
      const key = legacyJwk ? await importDekJwk(legacyJwk) : await generateDek();
      await idbPutDek(key);
      if (legacyJwk) await import_webextension_polyfill3.default.storage.local.remove(DEK_STORAGE_KEY);
      return key;
    })().finally(() => {
      autoDekCreation = null;
    });
    return autoDekCreation;
  }
  async function getExistingAutoDek() {
    const existing = await idbGetDek();
    if (existing) return existing;
    const stored = await import_webextension_polyfill3.default.storage.local.get(DEK_STORAGE_KEY);
    if (stored[DEK_STORAGE_KEY]) return getOrCreateAutoDek();
    return null;
  }
  async function resolveDek({ create }) {
    if (await getLockMode() === LOCK_MODES.BIOMETRIC) {
      const cached = await readDekCache();
      if (!cached) return { locked: true };
      return { key: await importDekRaw(cached.raw) };
    }
    const key = create ? await getOrCreateAutoDek() : await getExistingAutoDek();
    return { key };
  }
  async function getOrCreateProfileKey() {
    const existing = await idbGetProfileKey();
    if (existing) return existing;
    const key = await generateDek();
    await idbPutProfileKey(key);
    return key;
  }
  async function writeProfileMirror(settings) {
    try {
      const profile = {
        enabled: settings.enabled !== false,
        email: String(settings.email || ""),
        autoClickNext: settings.autoClickNext !== false,
        clickDelayMs: settings.clickDelayMs,
        hasPassword: Boolean(settings.password?.trim())
      };
      const envelope = await encryptJson(await getOrCreateProfileKey(), profile);
      await import_webextension_polyfill3.default.storage.local.set({ [PROFILE_STORAGE_KEY]: envelope });
    } catch {
    }
  }
  async function loadProfile() {
    try {
      const stored = await import_webextension_polyfill3.default.storage.local.get(PROFILE_STORAGE_KEY);
      const envelope = stored[PROFILE_STORAGE_KEY];
      if (!isValidEnvelope(envelope)) return null;
      const key = await idbGetProfileKey();
      if (!key) return null;
      const profile = await decryptJson(key, envelope);
      return profile?.email ? profile : null;
    } catch {
      return null;
    }
  }
  async function clearProfile() {
    await import_webextension_polyfill3.default.storage.local.remove(PROFILE_STORAGE_KEY);
    await idbDeleteProfileKey().catch(() => {
    });
  }
  async function hasStoredSettingsEnvelope() {
    const stored = await import_webextension_polyfill3.default.storage.local.get(SETTINGS_STORAGE_KEY);
    const envelope = stored[SETTINGS_STORAGE_KEY];
    return Boolean(envelope && typeof envelope === "object");
  }
  async function loadDecryptedSettingsResult() {
    const stored = await import_webextension_polyfill3.default.storage.local.get(SETTINGS_STORAGE_KEY);
    const envelope = stored[SETTINGS_STORAGE_KEY];
    if (!envelope) {
      return { ok: true, settings: normalizeSettings({}) };
    }
    if (!isValidEnvelope(envelope)) return { ok: false, reason: "corrupt" };
    const dek = await resolveDek({ create: false });
    if (dek.locked) return { ok: false, reason: "locked" };
    if (!dek.key) return { ok: false, reason: "corrupt" };
    let json;
    try {
      json = await decryptJson(dek.key, envelope);
    } catch {
      return { ok: false, reason: "corrupt" };
    }
    if (envelope.v !== 2) {
      try {
        const upgraded = await encryptJson(dek.key, json);
        await import_webextension_polyfill3.default.storage.local.set({ [SETTINGS_STORAGE_KEY]: upgraded });
      } catch {
      }
    }
    return { ok: true, settings: normalizeSettings(json) };
  }
  async function saveEncryptedSettings(values) {
    const validation = validateSettingsForSave(values);
    if (!validation.ok) return validation;
    const dek = await resolveDek({ create: true });
    if (dek.locked) {
      return {
        ok: false,
        locked: true,
        error: "Unlock with Touch ID / Face ID first."
      };
    }
    const payload = validation.settings;
    const envelope = await encryptJson(dek.key, payload);
    await import_webextension_polyfill3.default.storage.local.set({ [SETTINGS_STORAGE_KEY]: envelope });
    if (await getLockMode() === LOCK_MODES.BIOMETRIC) await writeProfileMirror(payload);
    return { ok: true, settings: payload };
  }
  async function clearExtensionStorageData() {
    await import_webextension_polyfill3.default.storage.local.remove([DEK_STORAGE_KEY, SETTINGS_STORAGE_KEY]);
    await clearProfile();
    await idbDeleteDek().catch(() => {
    });
    await clearDekCache();
  }

  // extension/background/settings-lock.js
  var import_webextension_polyfill4 = __toESM(require_browser_polyfill(), 1);

  // shared/lib/crypto.js
  var PBKDF2_ITERATIONS = 6e5;
  var LEGACY_PBKDF2_ITERATIONS = 1e5;
  var PBKDF2_SALT_BYTES = 16;
  function timingSafeEqualBytes(a, b) {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
    return mismatch === 0;
  }
  function timingSafeEqualString(a, b) {
    const enc2 = new TextEncoder();
    const ba = enc2.encode(String(a));
    const bb = enc2.encode(String(b));
    if (ba.length !== bb.length) {
      return false;
    }
    return timingSafeEqualBytes(ba, bb);
  }
  async function derivePbkdf2Sha256(password, saltBytes, iterations = PBKDF2_ITERATIONS) {
    const enc2 = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc2.encode(String(password)),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    return new Uint8Array(bits);
  }
  async function hashCustomLockPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
    const hash = await derivePbkdf2Sha256(password, salt, PBKDF2_ITERATIONS);
    return {
      salt: bytesToBase64(salt),
      hash: bytesToBase64(hash),
      iter: PBKDF2_ITERATIONS
    };
  }
  async function verifyCustomLockPassword(password, saltB64, hashB64, iterations = LEGACY_PBKDF2_ITERATIONS) {
    if (!saltB64 || !hashB64) return false;
    const salt = base64ToBytes(saltB64);
    const expected = base64ToBytes(hashB64);
    const derived = await derivePbkdf2Sha256(password, salt, iterations);
    return timingSafeEqualBytes(derived, expected);
  }

  // shared/lib/throttle.js
  var FREE_ATTEMPTS = 3;
  var BASE_DELAY_MS = 5e3;
  var MAX_DELAY_MS = 5 * 6e4;
  function lockoutDelayMs(failCount) {
    if (!Number.isFinite(failCount) || failCount <= FREE_ATTEMPTS - 1) return 0;
    const exponent = failCount - FREE_ATTEMPTS;
    return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** exponent);
  }
  function remainingLockoutMs(state, now = Date.now()) {
    const until = Number(state?.until) || 0;
    return Math.max(0, until - now);
  }
  function nextFailureState(state, now = Date.now()) {
    const count = (Number(state?.count) || 0) + 1;
    return { count, until: now + lockoutDelayMs(count) };
  }

  // extension/background/settings-lock.js
  var UNLOCK_FAILS_KEY = "csnyExtension.unlockFails.v1";
  async function clearLockStorageData() {
    await import_webextension_polyfill4.default.storage.local.remove(LOCK_STORAGE_KEY);
    await sessionRemove(UNLOCK_FAILS_KEY);
  }
  async function buildLockMetaFromSetup(lockInput, settingsForSameAsLogin) {
    if (lockInput?.mode === LOCK_MODES.BIOMETRIC) {
      return { ok: false, error: "Use biometric setup for this mode." };
    }
    const validation = validateLockSetup({
      mode: lockInput.mode,
      settingsPassword: lockInput.settingsPassword,
      confirmPassword: lockInput.confirmPassword,
      loginPassword: lockInput.mode === LOCK_MODES.SAME_AS_LOGIN ? settingsForSameAsLogin.password : lockInput.loginPassword
    });
    if (!validation.ok) return validation;
    if (validation.mode === LOCK_MODES.SAME_AS_LOGIN) {
      return {
        ok: true,
        meta: {
          configured: true,
          mode: LOCK_MODES.SAME_AS_LOGIN
        }
      };
    }
    const password = String(lockInput.settingsPassword ?? "");
    const { salt, hash, iter } = await hashCustomLockPassword(password);
    return {
      ok: true,
      meta: {
        configured: true,
        mode: LOCK_MODES.CUSTOM,
        salt,
        hash,
        iter
      }
    };
  }
  function formatWait(ms) {
    const seconds = Math.ceil(ms / 1e3);
    if (seconds < 60) return `${seconds} s`;
    return `${Math.ceil(seconds / 60)} min`;
  }
  async function checkNotLockedOut() {
    const remaining = remainingLockoutMs(await sessionGet(UNLOCK_FAILS_KEY));
    if (remaining > 0) {
      return {
        ok: false,
        throttled: true,
        error: `Too many attempts. Try again in ${formatWait(remaining)}.`
      };
    }
    return null;
  }
  async function recordFailure() {
    const state = nextFailureState(await sessionGet(UNLOCK_FAILS_KEY));
    await sessionSet(UNLOCK_FAILS_KEY, state);
  }
  async function comparePassword(meta, attempt) {
    if (meta.mode === LOCK_MODES.SAME_AS_LOGIN) {
      const loadResult = await loadDecryptedSettingsResult();
      if (!loadResult.ok) return false;
      const saved = loadResult.settings.password;
      if (!saved?.trim()) return false;
      return timingSafeEqualString(attempt, saved);
    }
    if (meta.mode === LOCK_MODES.CUSTOM) {
      const iterations = Number(meta.iter) || LEGACY_PBKDF2_ITERATIONS;
      const valid = await verifyCustomLockPassword(
        attempt,
        meta.salt,
        meta.hash,
        iterations
      );
      if (valid && iterations < PBKDF2_ITERATIONS) {
        const { salt, hash, iter } = await hashCustomLockPassword(attempt);
        await saveLockMeta({ ...meta, salt, hash, iter });
      }
      return valid;
    }
    return false;
  }
  async function verifyUnlockPassword(password) {
    const meta = await loadLockMeta();
    if (!meta?.configured) return { ok: true };
    const blocked = await checkNotLockedOut();
    if (blocked) return blocked;
    const attempt = String(password ?? "");
    if (!attempt) return { ok: false };
    const valid = await comparePassword(meta, attempt);
    if (!valid) {
      await recordFailure();
      return { ok: false };
    }
    await sessionRemove(UNLOCK_FAILS_KEY);
    return { ok: true };
  }

  // extension/background/biometric-vault.js
  var import_webextension_polyfill5 = __toESM(require_browser_polyfill(), 1);
  var PRF_BYTES = 32;
  function isBiometricMeta(meta) {
    return meta?.configured === true && meta.mode === LOCK_MODES.BIOMETRIC;
  }
  function describeBiometric(meta) {
    if (!isBiometricMeta(meta)) return null;
    return {
      credentialId: meta.credentialId,
      prfSalt: meta.prfSalt,
      transports: Array.isArray(meta.transports) ? meta.transports : [],
      policy: meta.policy,
      minutes: meta.minutes
    };
  }
  function decodePrf(prfOutputB64) {
    let bytes;
    try {
      bytes = base64ToBytes(String(prfOutputB64 ?? ""));
    } catch {
      return null;
    }
    return bytes.length === PRF_BYTES ? bytes : null;
  }
  async function enrollBiometric({ settings, enrollment, policy, minutes }) {
    const prf = decodePrf(enrollment?.prfOutput);
    if (!prf || !enrollment?.credentialId || !enrollment?.prfSalt) {
      return { ok: false, error: "Touch ID / Face ID setup was incomplete. Try again." };
    }
    const unlock = normalizeUnlockPolicy(policy, minutes);
    const dek = await generateDek({ extractable: true });
    const kek = await deriveKekFromPrf(prf);
    const { raw, wrapped } = await wrapDek(kek, dek);
    const envelope = await encryptJson(dek, settings);
    const meta = {
      configured: true,
      mode: LOCK_MODES.BIOMETRIC,
      credentialId: enrollment.credentialId,
      prfSalt: enrollment.prfSalt,
      transports: Array.isArray(enrollment.transports) ? enrollment.transports : [],
      wrappedDek: wrapped,
      policy: unlock.policy,
      minutes: unlock.minutes
    };
    await import_webextension_polyfill5.default.storage.local.set({
      [SETTINGS_STORAGE_KEY]: envelope,
      [LOCK_STORAGE_KEY]: meta
    });
    await idbDeleteDek().catch(() => {
    });
    await import_webextension_polyfill5.default.storage.local.remove(DEK_STORAGE_KEY);
    await writeProfileMirror(settings);
    if (unlock.policy === UNLOCK_POLICIES.ATTEMPT) {
      await clearDekCache();
    } else {
      await cacheBiometricDek(raw, unlock.policy, unlock.minutes);
    }
    return { ok: true };
  }
  async function unlockWithPrf(prfOutputB64, { forSignIn = true } = {}) {
    const meta = await loadLockMeta();
    if (!isBiometricMeta(meta)) return { ok: false, error: "Biometric unlock is not set up." };
    const prf = decodePrf(prfOutputB64);
    if (!prf) return { ok: false, error: "Biometric check failed." };
    let raw;
    try {
      raw = await unwrapRawDek(await deriveKekFromPrf(prf), meta.wrappedDek);
    } catch {
      return { ok: false, error: "That biometric didn't unlock your saved data." };
    }
    const existing = await readDekCache();
    const signInReady = forSignIn || meta.policy !== UNLOCK_POLICIES.ATTEMPT || existing?.forSignIn === true;
    await cacheBiometricDek(raw, meta.policy, meta.minutes, { forSignIn: signInReady });
    const loaded = await loadDecryptedSettingsResult();
    if (loaded.ok) await writeProfileMirror(loaded.settings);
    return { ok: true, forSignIn: signInReady };
  }
  async function updateBiometricPolicy(policy, minutes) {
    const meta = await loadLockMeta();
    if (!isBiometricMeta(meta)) return { ok: false, error: "Biometric unlock is not set up." };
    const unlock = normalizeUnlockPolicy(policy, minutes);
    await import_webextension_polyfill5.default.storage.local.set({
      [LOCK_STORAGE_KEY]: { ...meta, policy: unlock.policy, minutes: unlock.minutes }
    });
    const cached = await readDekCache();
    if (cached) {
      await cacheBiometricDek(cached.raw, unlock.policy, unlock.minutes, {
        forSignIn: unlock.policy === UNLOCK_POLICIES.ATTEMPT ? false : cached.forSignIn
      });
    }
    return { ok: true };
  }
  async function moveToAutoMode(settings, newLockMeta) {
    const dek = await generateDek();
    const envelope = await encryptJson(dek, settings);
    await idbPutDek(dek);
    await import_webextension_polyfill5.default.storage.local.set({
      [SETTINGS_STORAGE_KEY]: envelope,
      [LOCK_STORAGE_KEY]: newLockMeta
    });
    await clearDekCache();
    await clearProfile();
  }

  // extension/background/index.js
  var HOST_PATTERNS = [
    "*://collegiateschool.myschoolapp.com/*",
    "*://csny.onelogin.com/*",
    "*://app.blackbaud.com/*"
  ];
  var AUTOMATION_HOSTS = /* @__PURE__ */ new Set([
    "collegiateschool.myschoolapp.com",
    "csny.onelogin.com",
    "app.blackbaud.com"
  ]);
  var PASSWORD_HOST = "csny.onelogin.com";
  var UNLOCK_SESSION_TTL_MS = 30 * 60 * 1e3;
  var UNLOCK_SESSIONS_KEY = "csnyExtension.unlockSessions.v1";
  var PROMPT_STATE_KEY = "csnyExtension.prompt.v1";
  var PROMPT_COOLDOWN_MS = 60 * 1e3;
  var SETTINGS_CORRUPT_MESSAGE = "Saved settings could not be read. Clear all saved data to start over.";
  var SAME_AS_LOGIN_PASSWORD_MESSAGE = "Your OneLogin password unlocks settings. Choose a separate settings password under protection before removing it.";
  var BIOMETRIC_LOCKED_MESSAGE = "Unlock with Touch ID / Face ID first.";
  var CONTEXT_MENU_SETTINGS_ID = "collegiate-open-settings";
  var CONTEXT_MENU_PAUSE_ID = "collegiate-pause";
  var CONTEXT_MENU_RESUME_ID = "collegiate-resume";
  var PAUSE_KEY = "csnyExtension.pausedUntil.v1";
  var PAUSE_ALARM = "csny-resume";
  var PAUSE_DURATION_MS = 60 * 60 * 1e3;
  function isExtensionPageSender(sender) {
    const url = sender?.url || "";
    return url.startsWith(import_webextension_polyfill6.default.runtime.getURL(""));
  }
  function isContentScriptSender(sender) {
    if (!sender?.tab?.url) return false;
    try {
      const parsed = new URL(sender.tab.url);
      if (parsed.protocol !== "https:") return false;
      const host = parsed.hostname;
      return AUTOMATION_HOSTS.has(host);
    } catch {
      return false;
    }
  }
  function senderHost(sender) {
    try {
      return new URL(sender?.tab?.url || "").hostname;
    } catch {
      return "";
    }
  }
  async function createUnlockSession() {
    const sessions = await sessionGet(UNLOCK_SESSIONS_KEY) || {};
    const now = Date.now();
    for (const [nonce2, expiresAt] of Object.entries(sessions)) {
      if (expiresAt < now) delete sessions[nonce2];
    }
    const nonce = crypto.randomUUID();
    sessions[nonce] = now + UNLOCK_SESSION_TTL_MS;
    await sessionSet(UNLOCK_SESSIONS_KEY, sessions);
    return nonce;
  }
  async function isUnlockSessionValid(nonce) {
    if (!nonce || typeof nonce !== "string") return false;
    const sessions = await sessionGet(UNLOCK_SESSIONS_KEY) || {};
    const expiresAt = sessions[nonce];
    return typeof expiresAt === "number" && Date.now() <= expiresAt;
  }
  function clearUnlockSessions() {
    return sessionRemove(UNLOCK_SESSIONS_KEY);
  }
  async function broadcast(message) {
    const tabs = await import_webextension_polyfill6.default.tabs.query({ url: HOST_PATTERNS });
    for (const tab of tabs) {
      if (tab.id == null) continue;
      try {
        await import_webextension_polyfill6.default.tabs.sendMessage(tab.id, message);
      } catch {
      }
    }
  }
  var broadcastSettingsChanged = async () => {
    await updateBadge();
    await broadcast({ type: "SETTINGS_CHANGED" });
  };
  var broadcastSettingsLocked = async () => {
    await updateBadge();
    await broadcast({ type: "SETTINGS_LOCKED" });
  };
  async function isPaused() {
    const until = await sessionGet(PAUSE_KEY);
    return typeof until === "number" && Date.now() < until;
  }
  async function syncPauseMenu() {
    try {
      const paused = await isPaused();
      await import_webextension_polyfill6.default.contextMenus.update(CONTEXT_MENU_PAUSE_ID, { visible: !paused });
      await import_webextension_polyfill6.default.contextMenus.update(CONTEXT_MENU_RESUME_ID, { visible: paused });
    } catch {
    }
  }
  async function setPaused(paused) {
    if (paused) {
      const until = Date.now() + PAUSE_DURATION_MS;
      await sessionSet(PAUSE_KEY, until);
      await import_webextension_polyfill6.default.alarms?.create(PAUSE_ALARM, { when: until });
    } else {
      await sessionRemove(PAUSE_KEY);
      await import_webextension_polyfill6.default.alarms?.clear(PAUSE_ALARM);
    }
    await syncPauseMenu();
    await broadcastSettingsChanged();
  }
  async function updateBadge() {
    try {
      let text = "";
      if (await isPaused()) {
        text = "OFF";
      } else if (await isBiometricLocked()) {
        const profile = await loadProfile();
        if (profile?.enabled === false) text = "OFF";
      } else {
        const result = await loadDecryptedSettingsResult();
        if (result.ok && result.settings.enabled === false) text = "OFF";
      }
      await import_webextension_polyfill6.default.action?.setBadgeText?.({ text });
      await import_webextension_polyfill6.default.action?.setBadgeBackgroundColor?.({ color: "#6b7280" });
    } catch {
    }
  }
  async function isBiometricLocked() {
    if (await getLockMode() !== LOCK_MODES.BIOMETRIC) return false;
    const cached = await readDekCache();
    return !cached?.forSignIn;
  }
  async function broadcastSettingsChangedIfReady() {
    if (await isBiometricLocked()) {
      await updateBadge();
      return;
    }
    await broadcastSettingsChanged();
  }
  var promptInFlight = null;
  function openUnlockWindow({ force = false } = {}) {
    promptInFlight ??= (async () => {
      const state = await sessionGet(PROMPT_STATE_KEY) || {};
      if (state.windowId != null) {
        try {
          await import_webextension_polyfill6.default.windows.update(state.windowId, { focused: true });
          return;
        } catch {
        }
      }
      if (!force && Date.now() - (state.lastAt || 0) < PROMPT_COOLDOWN_MS) return;
      await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now() });
      const width = 420;
      const height = 380;
      const position = {};
      try {
        const parent = await import_webextension_polyfill6.default.windows.getLastFocused();
        if (parent.left != null && parent.width && parent.top != null && parent.height) {
          position.left = Math.max(0, Math.round(parent.left + (parent.width - width) / 2));
          position.top = Math.max(0, Math.round(parent.top + (parent.height - height) / 2));
        }
      } catch {
      }
      const win = await import_webextension_polyfill6.default.windows.create({
        url: import_webextension_polyfill6.default.runtime.getURL("popup/unlock.html"),
        type: "popup",
        width,
        height,
        ...position,
        focused: true
      });
      await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now(), windowId: win.id });
    })().catch(() => {
    }).finally(() => {
      promptInFlight = null;
    });
    return promptInFlight;
  }
  import_webextension_polyfill6.default.windows?.onRemoved.addListener(async (windowId) => {
    const state = await sessionGet(PROMPT_STATE_KEY);
    if (state?.windowId === windowId) {
      await sessionSet(PROMPT_STATE_KEY, { lastAt: Date.now() });
    }
  });
  async function handleRelocked() {
    await broadcastSettingsLocked();
  }
  import_webextension_polyfill6.default.alarms?.onAlarm.addListener(async (alarm) => {
    if (alarm.name === PAUSE_ALARM) {
      await setPaused(false);
      return;
    }
    if (alarm.name !== RELOCK_ALARM) return;
    if ((await readDekCache())?.forSignIn) return;
    await handleRelocked();
  });
  async function isSettingsCorrupt() {
    if (!await hasStoredSettingsEnvelope()) return false;
    const result = await loadDecryptedSettingsResult();
    return !result.ok && result.reason === "corrupt";
  }
  async function handleGetPopupState() {
    const meta = await loadLockMeta();
    const configured = meta?.configured === true;
    const hasEnvelope = await hasStoredSettingsEnvelope();
    const loadResult = await loadDecryptedSettingsResult();
    const settingsCorrupt = hasEnvelope && !loadResult.ok && loadResult.reason === "corrupt";
    const migrationPending = !configured && hasEnvelope && !settingsCorrupt;
    const suggestSameAsLoginLock = migrationPending && loadResult.ok && Boolean(loadResult.settings.password?.trim());
    const lockMode = await getLockMode();
    return {
      ok: true,
      configured,
      locked: configured,
      migrationPending,
      settingsCorrupt,
      suggestSameAsLoginLock,
      lockMode,
      biometric: describeBiometric(meta)
    };
  }
  async function handleUnlockSettings(message) {
    if (await getLockMode() === LOCK_MODES.BIOMETRIC) {
      return { ok: false, error: "Use Touch ID / Face ID to unlock." };
    }
    const verification = await verifyUnlockPassword(message?.password);
    if (!verification.ok) {
      return {
        ok: false,
        error: verification.error || "Incorrect settings password."
      };
    }
    const loadResult = await loadDecryptedSettingsResult();
    if (!loadResult.ok) {
      return {
        ok: false,
        error: SETTINGS_CORRUPT_MESSAGE,
        corrupt: true
      };
    }
    const sessionNonce = await createUnlockSession();
    return { ok: true, settings: loadResult.settings, sessionNonce };
  }
  async function handleUnlockBiometric(message) {
    const unlocked = await unlockWithPrf(message?.prfOutput, {
      forSignIn: message?.forSignIn === true
    });
    if (!unlocked.ok) return unlocked;
    if (unlocked.forSignIn) await broadcastSettingsChanged();
    if (message?.forSignIn === true) return { ok: true };
    const loadResult = await loadDecryptedSettingsResult();
    if (!loadResult.ok) {
      return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
    }
    const sessionNonce = await createUnlockSession();
    return { ok: true, settings: loadResult.settings, sessionNonce };
  }
  async function handleSaveSettings(message) {
    const lockConfigured = await isLockConfigured();
    const lockConfig = message?.lock;
    const migration = message?.migration === true;
    if (await isSettingsCorrupt()) {
      return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
    }
    if (lockConfigured && !await isUnlockSessionValid(message?.sessionNonce)) {
      return { ok: false, error: "Unlock the settings screen before saving." };
    }
    if (!lockConfigured && lockConfig) {
      let settingsForSave;
      if (migration) {
        const existingResult = await loadDecryptedSettingsResult();
        if (!existingResult.ok) {
          return {
            ok: false,
            error: SETTINGS_CORRUPT_MESSAGE,
            corrupt: true
          };
        }
        const patch = message?.settings && typeof message.settings === "object" ? message.settings : {};
        const validation = validateSettingsForSave({ ...existingResult.settings, ...patch });
        if (!validation.ok) return validation;
        settingsForSave = validation.settings;
      } else {
        const validation = validateSettingsForSave(message?.settings);
        if (!validation.ok) return validation;
        settingsForSave = validation.settings;
      }
      if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
        const enrolled = await enrollBiometric({
          settings: settingsForSave,
          enrollment: lockConfig.enrollment,
          policy: lockConfig.policy,
          minutes: lockConfig.minutes
        });
        if (!enrolled.ok) return enrolled;
        await broadcastSettingsChangedIfReady();
        return { ok: true, settings: settingsForSave };
      }
      const lockResult = await buildLockMetaFromSetup(lockConfig, settingsForSave);
      if (!lockResult.ok) return lockResult;
      const saveResult2 = await saveEncryptedSettings(settingsForSave);
      if (!saveResult2.ok) return saveResult2;
      await saveLockMeta(lockResult.meta);
      await broadcastSettingsChangedIfReady();
      return saveResult2;
    }
    if (lockConfigured && await getLockMode() === LOCK_MODES.SAME_AS_LOGIN && !normalizeSettings(message?.settings).password.trim()) {
      return { ok: false, error: SAME_AS_LOGIN_PASSWORD_MESSAGE };
    }
    const saveResult = await saveEncryptedSettings(message?.settings);
    if (!saveResult.ok) return saveResult;
    await broadcastSettingsChangedIfReady();
    return saveResult;
  }
  async function handleUpdateLock(message) {
    if (!await isLockConfigured()) {
      return { ok: false, error: "Settings protection is not configured yet." };
    }
    if (!await isUnlockSessionValid(message?.sessionNonce)) {
      return { ok: false, error: "Unlock the settings screen before changing protection." };
    }
    const currentMode = await getLockMode();
    const lock = message?.lock;
    const loadResult = await loadDecryptedSettingsResult();
    if (!loadResult.ok) {
      if (loadResult.reason === "locked") {
        return { ok: false, error: BIOMETRIC_LOCKED_MESSAGE, locked: true };
      }
      return { ok: false, error: SETTINGS_CORRUPT_MESSAGE, corrupt: true };
    }
    if (lock?.mode === LOCK_MODES.BIOMETRIC) {
      const result = currentMode === LOCK_MODES.BIOMETRIC ? await updateBiometricPolicy(lock.policy, lock.minutes) : await enrollBiometric({
        settings: loadResult.settings,
        enrollment: lock.enrollment,
        policy: lock.policy,
        minutes: lock.minutes
      });
      if (!result.ok) return result;
    } else {
      const lockResult = await buildLockMetaFromSetup(lock, loadResult.settings);
      if (!lockResult.ok) return lockResult;
      if (currentMode === LOCK_MODES.BIOMETRIC) {
        await moveToAutoMode(loadResult.settings, lockResult.meta);
      } else {
        await saveLockMeta(lockResult.meta);
      }
    }
    await clearUnlockSessions();
    await broadcastSettingsChangedIfReady();
    return { ok: true };
  }
  async function handleResetExtensionData(message) {
    if (message?.confirm !== true) {
      return { ok: false, error: "Confirmation required." };
    }
    await clearExtensionStorageData();
    await clearLockStorageData();
    await clearUnlockSessions();
    await sessionRemove(PROMPT_STATE_KEY);
    await setPaused(false);
    await handleRelocked();
    return { ok: true };
  }
  async function handleGetSettings(sender) {
    const response = await loadSettingsResponse(sender);
    if (response.ok && response.settings && await isPaused()) {
      return { ...response, settings: { ...response.settings, enabled: false } };
    }
    return response;
  }
  async function loadSettingsResponse(sender) {
    if (await isBiometricLocked()) {
      const profile = await loadProfile();
      if (!profile) return { ok: false, locked: true, needsProfile: true };
      return {
        ok: true,
        settings: { ...profile, password: "" },
        passwordLocked: profile.hasPassword === true
      };
    }
    const result = await loadDecryptedSettingsResult();
    if (!result.ok) {
      return result.reason === "locked" ? { ok: false, locked: true, needsProfile: true } : { ok: false, error: "Could not load settings." };
    }
    const settings = senderHost(sender) === PASSWORD_HOST ? result.settings : { ...result.settings, password: "" };
    return { ok: true, settings, passwordLocked: false };
  }
  async function handleRequestSignInUnlock(sender) {
    if (!await isBiometricLocked()) return { ok: true, alreadyUnlocked: true };
    if (senderHost(sender) !== PASSWORD_HOST) return { ok: false, error: "Forbidden." };
    await openUnlockWindow();
    return { ok: true };
  }
  async function handleFlowDone() {
    const cached = await readDekCache();
    if (cached?.policy !== "attempt") return { ok: true };
    await clearDekCache();
    await handleRelocked();
    return { ok: true };
  }
  function extensionPageOnly(handler, errorMessage) {
    return (message, sender) => {
      if (!isExtensionPageSender(sender)) {
        return Promise.resolve({ ok: false, error: "Forbidden." });
      }
      return handler(message).catch(() => ({ ok: false, error: errorMessage }));
    };
  }
  var MESSAGE_HANDLERS = {
    GET_POPUP_STATE: extensionPageOnly(handleGetPopupState, "Could not load popup state."),
    UNLOCK_SETTINGS: extensionPageOnly(handleUnlockSettings, "Could not unlock settings."),
    UNLOCK_BIOMETRIC: extensionPageOnly(handleUnlockBiometric, "Could not unlock settings."),
    SAVE_SETTINGS: extensionPageOnly(handleSaveSettings, "Could not save settings."),
    UPDATE_LOCK: extensionPageOnly(handleUpdateLock, "Could not update settings protection."),
    RESET_EXTENSION_DATA: extensionPageOnly(
      handleResetExtensionData,
      "Could not reset extension data."
    ),
    GET_SETTINGS: (message, sender) => {
      if (!isContentScriptSender(sender)) {
        return Promise.resolve({ ok: false, error: "Forbidden." });
      }
      return handleGetSettings(sender).catch(() => ({
        ok: false,
        error: "Could not load settings."
      }));
    },
    REQUEST_SIGN_IN_UNLOCK: (message, sender) => {
      if (!isContentScriptSender(sender)) {
        return Promise.resolve({ ok: false, error: "Forbidden." });
      }
      return handleRequestSignInUnlock(sender).catch(() => ({ ok: false }));
    },
    FLOW_DONE: (message, sender) => {
      if (!isContentScriptSender(sender)) {
        return Promise.resolve({ ok: false, error: "Forbidden." });
      }
      return handleFlowDone().catch(() => ({ ok: false }));
    }
  };
  import_webextension_polyfill6.default.runtime.onMessage.addListener((message, sender) => {
    if (!message || typeof message.type !== "string") {
      return Promise.resolve({ ok: false, error: "Invalid message." });
    }
    const handler = Object.hasOwn(MESSAGE_HANDLERS, message.type) ? MESSAGE_HANDLERS[message.type] : null;
    if (!handler) return Promise.resolve({ ok: false, error: "Unknown message type." });
    return handler(message, sender);
  });
  function isAutomationUrl(url) {
    try {
      return AUTOMATION_HOSTS.has(new URL(url).hostname);
    } catch {
      return false;
    }
  }
  function registerSettingsContextMenu() {
    return import_webextension_polyfill6.default.contextMenus.removeAll().then(
      () => import_webextension_polyfill6.default.contextMenus.create({
        id: CONTEXT_MENU_SETTINGS_ID,
        title: "CSNYPass settings",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS
      })
    ).then(
      () => import_webextension_polyfill6.default.contextMenus.create({
        id: CONTEXT_MENU_PAUSE_ID,
        title: "Pause auto sign-in for 1 hour",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS
      })
    ).then(
      () => import_webextension_polyfill6.default.contextMenus.create({
        id: CONTEXT_MENU_RESUME_ID,
        title: "Resume auto sign-in",
        contexts: ["page"],
        documentUrlPatterns: HOST_PATTERNS,
        visible: false
      })
    ).then(syncPauseMenu).catch(() => {
    });
  }
  import_webextension_polyfill6.default.runtime.onInstalled.addListener((details) => {
    registerSettingsContextMenu();
    if (details?.reason === "install") {
      import_webextension_polyfill6.default.tabs.create({ url: import_webextension_polyfill6.default.runtime.getURL("popup/welcome.html") }).catch(() => {
      });
    }
  });
  import_webextension_polyfill6.default.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === CONTEXT_MENU_SETTINGS_ID) {
      import_webextension_polyfill6.default.runtime.openOptionsPage().catch(() => {
      });
    } else if (info.menuItemId === CONTEXT_MENU_PAUSE_ID) {
      setPaused(true).catch(() => {
      });
    } else if (info.menuItemId === CONTEXT_MENU_RESUME_ID) {
      setPaused(false).catch(() => {
      });
    }
  });
  updateBadge();
  syncPauseMenu();
  import_webextension_polyfill6.default.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId !== 0) return;
    if (!isAutomationUrl(details.url)) return;
    import_webextension_polyfill6.default.tabs.sendMessage(details.tabId, {
      type: "NAVIGATION_COMPLETED",
      url: details.url
    }).catch(() => {
    });
  });
})();
//# sourceMappingURL=background.js.map
