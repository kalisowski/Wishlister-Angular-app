export interface Game {
  readonly [key: string]: string | number | boolean | string[];
  readonly id: string;
  readonly title: string;
  readonly platform: string;
  readonly developer: string;
  readonly price: number;
  readonly wishlistPriority: number;
  readonly releaseStatus: boolean;
  readonly releaseDate: string;
  readonly tags: string[];
  readonly purchaseLinks: string[];
  readonly personalNotes: string;
}
