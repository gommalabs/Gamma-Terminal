const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs to renderer process
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
});
