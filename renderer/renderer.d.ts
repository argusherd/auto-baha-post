export interface Electron {
  getTables(): Promise<Object[]>;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
  }
}
