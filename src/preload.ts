// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

contextBridge.exposeInMainWorld('electronAPI', {
  transcribeAudio: (filePath: string) => ipcRenderer.invoke('transcribe-audio', filePath),
  saveFile: (fileName: string, buffer: Uint8Array): string => {
    const filePath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  },
  deleteFile: (filePath: string): void => {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }
});

