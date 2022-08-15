export interface StoreAuthorization {
  userId: string;
  accessLevel: AccessLevel;
}

export type AccessLevel = "salesman" | "manager";
export const AccessLevel = {
  Salesman: "salesman" as AccessLevel,
  Manager: "manager" as AccessLevel,
};
