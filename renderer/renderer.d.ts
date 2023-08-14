export interface Electron {
  openBaha(): Promise<void>;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
  }
}
