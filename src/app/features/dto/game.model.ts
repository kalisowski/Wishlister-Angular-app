import { Dlc } from './dlc.model';

export interface Game {
  readonly [key: string]: string | null | number | boolean | string[] | Dlc[];
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
  readonly personalNotes: string | null;
  readonly dlcs: Dlc[];
}
