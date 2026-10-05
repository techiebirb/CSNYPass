/** In-memory stand-ins for the WebExtension APIs the background modules touch. */

function makeArea() {
  let data = {};
  return {
    async get(keys) {
      if (keys == null) return structuredClone(data);
      const list = Array.isArray(keys) ? keys : [keys];
      const out = {};
      for (const key of list) if (key in data) out[key] = structuredClone(data[key]);
      return out;
    },
    async set(obj) {
      for (const [key, value] of Object.entries(obj)) data[key] = structuredClone(value);
    },
    async remove(keys) {
      for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key];
    },
    _dump: () => structuredClone(data),
    _reset: () => {
      data = {};
    },
  };
}

export const local = makeArea();
export const session = makeArea();
const noopEvent = { addListener() {} };

export const windows = {
  created: [],
  async create(options) {
    const win = { id: this.created.length + 1, ...options };
    this.created.push(win);
    return win;
  },
  async update() {
    throw new Error("no such window");
  },
  onRemoved: noopEvent,
};

export const runtime = {
  getURL: (p) => `chrome-extension://test/${p}`,
  /** The last registered onMessage listener; tests call it like the browser would. */
  listener: null,
  onMessage: {
    addListener(fn) {
      runtime.listener = fn;
    },
  },
  /** The last registered onInstalled listener; tests call it like the browser would. */
  installedListener: null,
  onInstalled: {
    addListener(fn) {
      runtime.installedListener = fn;
    },
  },
  async openOptionsPage() {},
};

export const alarms = {
  onAlarm: noopEvent,
  created: [],
  async create(name, info) {
    this.created.push({ name, ...info });
  },
  async clear(name) {
    this.created = this.created.filter((a) => a.name !== name);
    return true;
  },
};

export const action = {
  onClicked: noopEvent,
  badge: "",
  async setBadgeText({ text }) {
    action.badge = text;
  },
  async setBadgeBackgroundColor() {},
};

export const tabs = {
  created: [],
  async create(options) {
    const tab = { id: this.created.length + 1, ...options };
    this.created.push(tab);
    return tab;
  },
  query: async () => [],
  sendMessage: async () => {},
};

export function resetBrowser() {
  local._reset();
  session._reset();
  alarms.created = [];
  windows.created = [];
  tabs.created = [];
  action.badge = "";
}

const browser = {
  storage: { local, session },
  alarms,
  runtime,
  windows,
  tabs,
  contextMenus: {
    removeAll: async () => {},
    create() {},
    async update() {},
    onClicked: noopEvent,
  },
  webNavigation: { onCompleted: noopEvent },
  action,
};

export default browser;
