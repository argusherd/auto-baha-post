export interface Electron {
  openBaha(): Promise<void>;
  publishNow(postId: number): Promise<void>;
  getPostProperties(boardId: number): Promise<void>;
  refreshLoginStatus(callback: any): void;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
  }
}
