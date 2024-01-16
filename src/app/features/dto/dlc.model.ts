export interface Dlc {
  readonly [key: string]: string | number;
  readonly dlcId: string;
  readonly title: string;
  readonly price: number;
}
