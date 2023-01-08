export type PromoCode = {
  id: string;
  discount: number;
};

export type PromoCodes = Set<PromoCode>;
export type PaymentSystems = Map<string, string>;

type SavedCardItem = {
  id: number;
  qnt: number;
};

export interface SavedCart {
  promo: string[];
  items: SavedCardItem[];
  page: number;
  itemsOnPage: number;
}

export type ValidatingFunction = (value: string) => boolean;
