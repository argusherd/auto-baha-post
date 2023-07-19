import { DraftType } from "@/interfaces/drafts";
export interface Electron {
  getTables(): Promise<Object[]>;
  saveDraft(data: DraftType): Promise<void>;
}

declare global {
  interface Window {
    electron: Electron;
    backendUrl: string;
  }
}
