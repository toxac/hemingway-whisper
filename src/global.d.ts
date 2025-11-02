export {};

declare global {
  interface ElectronAPI {
    transcribeAudio(filePath: string): Promise<string>;
    saveFile: (fileName: string, buffer: Uint8Array) => string;
    deleteFile: (filePath: string) => void;
  }

  interface Window {
    electronAPI: ElectronAPI;
  }
}