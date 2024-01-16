import type { TagItem } from 'src/app/models/game-form/tags.model';

export interface CreateGame {
  readonly title: string;
  readonly platform: string;
  readonly developer: string;
  readonly price: number;
  readonly wishlistPriority: number;
  readonly releaseStatus: boolean;
  readonly releaseDate: Date | null;
  readonly tags: TagItem[];
  readonly purchaseLinks: string[];
  readonly personalNotes: string | null;
  readonly owner: string;
}
