export interface Electron {
  openBaha(): Promise<void>;
  publishNow(postId: number): Promise<void>;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
  }
}
