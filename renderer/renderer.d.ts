export interface Electron {
  openBaha(): Promise<void>;
  publishNow(postId: number): Promise<void>;
  getPostProperties(boardId: number): Promise<void>;
  loginStatusRefreshed(callback: any): void;
  refreshLoginStatus(): Promise<void>;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
    lng: string;
  }
}
