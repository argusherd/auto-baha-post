export interface Electron {
  openBaha(): Promise<void>;
  publishNow(postId: number): Promise<void>;
  getPostProperties(boardId: number): Promise<void>;
  loginStatusRefreshed(callback: Function): void;
  refreshLoginStatus(): Promise<void>;
  checkUpdate(): void;
  updateNotAvailable(callback: Function): void;
  updateAvailable(callback: Function): void;
  downloadUpdate(): void;
  downloadProgress(callback: (progress: number) => void): void;
  updateError(callback: (errorMessage: string) => void): void;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
    lng: string;
    currentVersion: string;
  }
}
