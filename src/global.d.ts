export {};

declare global {
  interface ElectronAPI {
    transcribeAudio(filePath: string): Promise<string>;
  }

  interface Window {
    electronAPI: ElectronAPI;
  }
}