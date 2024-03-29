export interface CreateGame {
  readonly title: string;
  readonly platform: string;
  readonly developer: string;
  readonly price: number;
  readonly wishlistPriority: number;
  readonly releaseStatus: boolean;
  readonly releaseDate: Date | null;
  readonly tags: string[];
  readonly purchaseLinks: string[];
  readonly personalNotes: string | null;
  readonly owner: string;
}
