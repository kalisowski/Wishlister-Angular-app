export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  developer: string;
  price: number;
  wishlistPriority: number;
  releaseStatus: boolean;
  releaseDate: Date | null;
  tags: string[];
  purchaseLinks: string[];
  personalNotes: string | null;
}
