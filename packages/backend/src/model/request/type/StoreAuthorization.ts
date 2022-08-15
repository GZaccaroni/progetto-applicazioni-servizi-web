export interface StoreAuthorization {
  userId: string;
  accessLevel: AccessLevel;
}

export enum AccessLevel {
  Salesman = "salesman",
  Manager = "manager",
}
