export interface MT5Account {
  accountNr: number;
  server: string;
}

export interface Subscription {
  licenseKey: string;
  productType: string;
  subscriptionType: string;
  subscriptionDate: string;
  expirationDate?: string; // Optional if it can be lifetime
  subscriptionPrice: number;
  number_of_license: number;
  mt5_accounts: MT5Account[]; // Assuming this is an array of MT5Account
}

export interface SubscriberData {
  email: string;
  firstName: string;
  lastName: string;
  subscription: Subscription[];
}

export interface UserData extends SubscriberData {
  mobileNumber: string;
} 