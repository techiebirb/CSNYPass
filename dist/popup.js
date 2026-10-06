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

  // extension/popup/popup.js
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
            name: RP_NAME,
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
  function setPrimaryBusy(button, busy) {
    if (!button) return;
    button.disabled = busy;
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

  // extension/popup/popup.js
  var sessionNonce = null;
  var migrationPending = false;
  var settingsCorrupt = false;
  var currentLockMode = null;
  var biometricInfo = null;
  var biometricSupported = false;
  var automationChip = document.querySelector("#automation-chip");
  function applyBiometricAvailability2(prefix) {
    applyBiometricAvailability(prefix, biometricSupported);
  }
  function openWelcomeTab() {
    import_webextension_polyfill.default.tabs.create({ url: import_webextension_polyfill.default.runtime.getURL("popup/welcome.html") }).catch(() => {
    });
    window.close();
  }
  var views = {
    unlock: document.querySelector("#view-unlock"),
    welcome: document.querySelector("#view-welcome"),
    editor: document.querySelector("#view-editor")
  };
  var EDITOR_SESSION_MS = 30 * 60 * 1e3;
  var editorTimer = null;
  var editorExpiresAt = 0;
  function stopEditorSession() {
    clearTimeout(editorTimer);
    editorTimer = null;
    editorExpiresAt = 0;
  }
  function startEditorSession() {
    stopEditorSession();
    editorExpiresAt = Date.now() + EDITOR_SESSION_MS;
    editorTimer = window.setTimeout(expireEditorSession, EDITOR_SESSION_MS);
  }
  function expireEditorSession() {
    if (views.editor?.hidden) return;
    for (const id of ["#edit-email", "#edit-password"]) {
      const el = document.querySelector(id);
      if (el) el.value = "";
    }
    sessionNonce = null;
    showUnlockWithMessage("Locked after 30 minutes. Unlock again to make changes.", false);
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && editorExpiresAt && Date.now() >= editorExpiresAt) {
      expireEditorSession();
    }
  });
  function showView(name) {
    for (const [key, el] of Object.entries(views)) {
      if (!el) continue;
      el.hidden = key !== name;
    }
    if (name !== "editor") stopEditorSession();
    syncAutomationChipForView(name);
  }
  function showUnlockWithMessage(message, ok = true) {
    showView("unlock");
    applyCorruptUnlockUi();
    const passwordEl = document.querySelector("#unlock-password");
    if (passwordEl) passwordEl.value = "";
    setStatus(document.querySelector("#unlock-status"), message, ok);
    if (!settingsCorrupt && currentLockMode !== LOCK_MODES.BIOMETRIC) {
      passwordEl?.focus();
    }
    if (ok && message) {
      window.setTimeout(() => {
        const statusEl = document.querySelector("#unlock-status");
        if (statusEl?.textContent === message) {
          setStatus(statusEl, "", false);
        }
      }, 3e3);
    }
  }
  function applyCorruptUnlockUi() {
    const corrupt = settingsCorrupt;
    const biometric = currentLockMode === LOCK_MODES.BIOMETRIC;
    const banner = document.querySelector("#unlock-corrupt-banner");
    const formSection = document.querySelector("#unlock-form-section");
    const bioSection = document.querySelector("#unlock-bio-section");
    const unlockBtn = document.querySelector("#btn-unlock");
    const intro = document.querySelector("#unlock-intro-hint");
    if (banner) banner.hidden = !corrupt;
    if (formSection) formSection.hidden = corrupt || biometric;
    if (bioSection) bioSection.hidden = corrupt || !biometric;
    if (unlockBtn) unlockBtn.hidden = corrupt || biometric;
    if (intro) {
      intro.hidden = corrupt;
      intro.textContent = biometric ? "Use Touch ID / Face ID to view or change your saved login details." : "Enter your settings password to view or change your saved login details.";
    }
  }
  function updateAutomationChip(enabled) {
    if (!automationChip) return;
    automationChip.hidden = false;
    automationChip.textContent = enabled ? "Automation on" : "Automation off";
    automationChip.className = "chip " + (enabled ? "chip-on" : "chip-off");
  }
  function hideAutomationChip() {
    if (!automationChip) return;
    automationChip.hidden = true;
    automationChip.textContent = "";
    automationChip.className = "chip";
  }
  function syncAutomationChipForView(viewName) {
    if (viewName === "editor") {
      const enabled = document.querySelector("#edit-enabled")?.checked !== false;
      updateAutomationChip(enabled);
      return;
    }
    hideAutomationChip();
  }
  function readLockConfigFromEditor() {
    return readLockConfig(
      "edit-lock",
      document.querySelector("#edit-password")?.value ?? ""
    );
  }
  function loadEditorLockForm(lockMode) {
    const biometric = lockMode === LOCK_MODES.BIOMETRIC;
    document.querySelector("#edit-lock-mode-bio").checked = biometric;
    document.querySelector("#edit-lock-mode-auto").checked = !biometric;
    const sameAsLoginEl = document.querySelector("#edit-lock-same-as-login");
    if (sameAsLoginEl) sameAsLoginEl.checked = lockMode === LOCK_MODES.SAME_AS_LOGIN;
    document.querySelector("#edit-lock-password").value = "";
    document.querySelector("#edit-lock-password-confirm").value = "";
    document.querySelector("#edit-lock-policy").value = biometricInfo?.policy ?? DEFAULT_UNLOCK_POLICY;
    document.querySelector("#edit-lock-minutes").value = String(
      biometricInfo?.minutes ?? DEFAULT_UNLOCK_MINUTES
    );
    applyBiometricAvailability2("edit-lock");
    syncLockModeVisibility("edit-lock");
  }
  function loadEditorFormValues(settings, lockMode = null) {
    document.querySelector("#edit-enabled").checked = settings.enabled !== false;
    document.querySelector("#edit-email").value = settings.email || "";
    document.querySelector("#edit-password").value = settings.password || "";
    document.querySelector("#edit-autoClickNext").checked = settings.autoClickNext !== false;
    setDelayMs("edit", settings.clickDelayMs ?? DEFAULTS.clickDelayMs);
    if (lockMode) loadEditorLockForm(lockMode);
    syncAutomationChipForView("editor");
  }
  function readEditorPayload() {
    return {
      enabled: document.querySelector("#edit-enabled").checked,
      email: document.querySelector("#edit-email").value.trim(),
      password: document.querySelector("#edit-password").value,
      autoClickNext: document.querySelector("#edit-autoClickNext").checked,
      clickDelayMs: document.querySelector("#edit-clickDelayMs").value
    };
  }
  function showWelcome() {
    const text = document.querySelector("#welcome-text");
    const button = document.querySelector("#btn-open-welcome");
    const title = document.querySelector("#welcome-title");
    if (title) title.textContent = migrationPending ? "One more step" : "Welcome to CSNYPass";
    if (text) {
      text.textContent = migrationPending ? "Your login details are saved. Choose how to protect your settings to finish." : "Sign in to school in one click. Setup takes about a minute.";
    }
    if (button) button.textContent = migrationPending ? "Protect my settings" : "Set up CSNYPass";
    showView("welcome");
    button?.focus();
  }
  async function handleResetExtensionData() {
    const confirmed = window.confirm(
      "Clear all saved email, passwords, and protection settings on this device? This cannot be undone."
    );
    if (!confirmed) return false;
    let result;
    try {
      result = await import_webextension_polyfill.default.runtime.sendMessage({
        type: "RESET_EXTENSION_DATA",
        confirm: true
      });
    } catch {
      return false;
    }
    if (!result?.ok) {
      window.alert(result?.error || "Could not clear extension data.");
      return false;
    }
    sessionNonce = null;
    migrationPending = false;
    settingsCorrupt = false;
    currentLockMode = null;
    biometricInfo = null;
    showWelcome();
    openWelcomeTab();
    return true;
  }
  async function refreshProtectionState() {
    try {
      const state = await import_webextension_polyfill.default.runtime.sendMessage({ type: "GET_POPUP_STATE" });
      currentLockMode = state?.lockMode ?? null;
      biometricInfo = state?.biometric ?? null;
    } catch {
    }
  }
  function enterEditor(settings) {
    loadEditorFormValues(normalizeSettings(settings), currentLockMode);
    setStatus(document.querySelector("#edit-lock-status"), "", false);
    showView("editor");
    startEditorSession();
    document.querySelector("#edit-email")?.focus();
  }
  async function handleUnlock() {
    const statusEl = document.querySelector("#unlock-status");
    const unlockBtn = document.querySelector("#btn-unlock");
    setStatus(statusEl, "", false);
    const password = document.querySelector("#unlock-password")?.value ?? "";
    setPrimaryBusy(unlockBtn, true);
    let result;
    try {
      result = await import_webextension_polyfill.default.runtime.sendMessage({
        type: "UNLOCK_SETTINGS",
        password
      });
    } catch (err) {
      const message = err && typeof err.message === "string" ? err.message : "Could not unlock settings.";
      setStatus(statusEl, message, false);
      setPrimaryBusy(unlockBtn, false);
      return;
    }
    setPrimaryBusy(unlockBtn, false);
    if (!result?.ok) {
      setStatus(statusEl, result?.error || "Incorrect settings password.", false);
      if (result?.corrupt) {
        settingsCorrupt = true;
        showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
      }
      return;
    }
    sessionNonce = result.sessionNonce || null;
    await refreshProtectionState();
    document.querySelector("#unlock-password").value = "";
    enterEditor(result.settings);
  }
  async function handleBiometricUnlock() {
    const statusEl = document.querySelector("#unlock-status");
    const button = document.querySelector("#btn-unlock-bio");
    setStatus(statusEl, "", false);
    if (!biometricInfo) {
      setStatus(statusEl, "Touch ID / Face ID isn't set up.", false);
      return;
    }
    setPrimaryBusy(button, true);
    let result;
    try {
      const prfOutput = await getPrfOutput(biometricInfo);
      result = await import_webextension_polyfill.default.runtime.sendMessage({ type: "UNLOCK_BIOMETRIC", prfOutput });
    } catch (err) {
      setStatus(statusEl, biometricErrorMessage(err), false);
      setPrimaryBusy(button, false);
      return;
    }
    setPrimaryBusy(button, false);
    if (!result?.ok) {
      setStatus(statusEl, result?.error || "Could not unlock settings.", false);
      if (result?.corrupt) {
        settingsCorrupt = true;
        showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
      }
      return;
    }
    sessionNonce = result.sessionNonce || null;
    enterEditor(result.settings);
  }
  async function handleEditorSave(e) {
    e.preventDefault();
    const statusEl = document.querySelector("#editor-status");
    const saveBtn = document.querySelector("#btn-editor-save");
    setStatus(statusEl, "", false);
    const payload = readEditorPayload();
    const validation = validateSettingsForSave(payload);
    if (!validation.ok) {
      setStatus(statusEl, validation.error, false);
      document.querySelector("#edit-email")?.focus();
      return;
    }
    if (currentLockMode === LOCK_MODES.SAME_AS_LOGIN && !validation.settings.password.trim()) {
      setStatus(
        statusEl,
        "Your OneLogin password unlocks settings. Choose a separate settings password under protection before removing it.",
        false
      );
      document.querySelector("#edit-password")?.focus();
      return;
    }
    setPrimaryBusy(saveBtn, true);
    let result;
    try {
      result = await import_webextension_polyfill.default.runtime.sendMessage({
        type: "SAVE_SETTINGS",
        settings: validation.settings,
        sessionNonce
      });
    } catch (err) {
      const message = err && typeof err.message === "string" ? err.message : "Could not save settings.";
      setStatus(statusEl, message, false);
      setPrimaryBusy(saveBtn, false);
      return;
    }
    setPrimaryBusy(saveBtn, false);
    if (!result?.ok) {
      setStatus(statusEl, result?.error || "Could not save settings.", false);
      if (result?.corrupt) {
        settingsCorrupt = true;
        sessionNonce = null;
        showUnlockWithMessage(result.error || "Saved settings could not be read.", false);
        return;
      }
      if (result?.locked || result?.error?.includes("Unlock")) {
        sessionNonce = null;
        showUnlockWithMessage(result?.error || "Unlock the settings screen first.", false);
      }
      return;
    }
    setStatus(statusEl, "Settings saved.", true);
    updateAutomationChip(validation.settings.enabled !== false);
    window.setTimeout(() => setStatus(statusEl, "", false), 2e3);
  }
  async function handleUpdateLock() {
    const statusEl = document.querySelector("#edit-lock-status");
    setStatus(statusEl, "", false);
    let lockConfig = readLockConfigFromEditor();
    const loginPassword = document.querySelector("#edit-password")?.value ?? "";
    const alreadyBiometric = currentLockMode === LOCK_MODES.BIOMETRIC;
    if (lockConfig.mode === LOCK_MODES.BIOMETRIC) {
    } else if (lockConfig.mode === LOCK_MODES.CUSTOM) {
      const lockValidation = validateLockSetup({
        mode: lockConfig.mode,
        settingsPassword: lockConfig.settingsPassword,
        confirmPassword: lockConfig.confirmPassword,
        loginPassword: ""
      });
      if (!lockValidation.ok) {
        setStatus(statusEl, lockValidation.error, false);
        return;
      }
    } else {
      const lockValidation = validateLockSetup({
        mode: lockConfig.mode,
        loginPassword
      });
      if (!lockValidation.ok) {
        setStatus(statusEl, lockValidation.error, false);
        return;
      }
    }
    const btn = document.querySelector("#btn-update-lock");
    setPrimaryBusy(btn, true);
    if (lockConfig.mode === LOCK_MODES.BIOMETRIC && !alreadyBiometric) {
      setStatus(statusEl, "Waiting for Touch ID / Face ID\u2026", true);
      try {
        lockConfig = await attachBiometricEnrollment(lockConfig);
      } catch (err) {
        setStatus(statusEl, biometricErrorMessage(err), false);
        setPrimaryBusy(btn, false);
        return;
      }
    }
    let result;
    try {
      result = await import_webextension_polyfill.default.runtime.sendMessage({
        type: "UPDATE_LOCK",
        lock: lockConfig,
        sessionNonce
      });
    } catch (err) {
      const message = err && typeof err.message === "string" ? err.message : "Could not update protection.";
      setStatus(statusEl, message, false);
      setPrimaryBusy(btn, false);
      return;
    }
    setPrimaryBusy(btn, false);
    if (!result?.ok) {
      setStatus(statusEl, result?.error || "Could not update protection.", false);
      if (result?.error?.includes("Unlock") || result?.locked || result?.corrupt) {
        sessionNonce = null;
        if (result?.corrupt) settingsCorrupt = true;
        showUnlockWithMessage(result?.error || "Unlock the settings screen first.", false);
      }
      return;
    }
    sessionNonce = null;
    await refreshProtectionState();
    showUnlockWithMessage(
      lockConfig.mode === LOCK_MODES.BIOMETRIC ? "Protection updated. Use Touch ID / Face ID to open settings." : "Protection updated. Enter your settings password to open settings.",
      true
    );
  }
  function wireLockModeControls(prefix) {
    for (const id of [`${prefix}-mode-auto`, `${prefix}-mode-bio`, `${prefix}-same-as-login`, `${prefix}-policy`]) {
      document.querySelector(`#${id}`)?.addEventListener("change", () => {
        syncLockModeVisibility(prefix);
      });
    }
    applyBiometricAvailability2(prefix);
    syncLockModeVisibility(prefix);
  }
  async function init() {
    wirePasswordToggles();
    wireDelayControls("edit");
    biometricSupported = await isBiometricSupported();
    document.querySelector("#edit-enabled")?.addEventListener("change", () => {
      syncAutomationChipForView("editor");
    });
    wireLockModeControls("edit-lock");
    document.querySelector("#btn-open-welcome")?.addEventListener("click", openWelcomeTab);
    document.querySelector("#view-editor")?.addEventListener("submit", handleEditorSave);
    document.querySelector("#btn-unlock")?.addEventListener("click", handleUnlock);
    document.querySelector("#btn-unlock-bio")?.addEventListener("click", handleBiometricUnlock);
    document.querySelector("#btn-update-lock")?.addEventListener("click", handleUpdateLock);
    document.querySelector("#unlock-password")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUnlock();
      }
    });
    document.querySelector("#btn-reset-from-unlock")?.addEventListener("click", () => {
      handleResetExtensionData();
    });
    let popupState;
    try {
      popupState = await import_webextension_polyfill.default.runtime.sendMessage({ type: "GET_POPUP_STATE" });
    } catch {
      popupState = { ok: false };
    }
    if (!popupState?.ok) {
      showWelcome();
      return;
    }
    migrationPending = popupState.migrationPending === true;
    settingsCorrupt = popupState.settingsCorrupt === true;
    currentLockMode = popupState.lockMode ?? null;
    biometricInfo = popupState.biometric ?? null;
    if (settingsCorrupt) {
      showUnlockWithMessage("", false);
      return;
    }
    if (!popupState.configured || migrationPending) {
      showWelcome();
      return;
    }
    showView("unlock");
    applyCorruptUnlockUi();
    if (currentLockMode !== LOCK_MODES.BIOMETRIC) {
      document.querySelector("#unlock-password")?.focus();
    }
  }
  init();
})();
//# sourceMappingURL=popup.js.map
