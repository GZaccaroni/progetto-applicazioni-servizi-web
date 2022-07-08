import { findStores } from "@/repositories/StoreRepository";
import { AsyncSelectItem } from "@/components/common/AsyncSelect.vue";
import { findUsers } from "@/repositories/UserRepository";
import i18n from "@/i18n";
import { DbStoreAccessLevel } from "@/model/db/DbStore";
import { DbUnitOfMeasure } from "@/model/db/DbUnitOfMeasure";

const selectMaxItems = 10;
export async function getSelectStores(
  query: string
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findStores({
    authorized: true,
    searchName: query,
    limit: selectMaxItems,
  });
  return paginatedResult.results.map((el) => {
    return {
      id: el.id,
      text: el.name,
    };
  });
}
export async function getSelectUsers(
  query: string
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findUsers({
    searchName: query,
    limit: selectMaxItems,
  });
  return paginatedResult.results.map((el) => {
    return {
      id: el.id,
      text: el.username,
    };
  });
}
export async function getSelectStoreAccessLevel(): Promise<AsyncSelectItem[]> {
  return Object.keys(DbStoreAccessLevel).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.store.accessLevel." + elKey).toString(),
    };
  });
}
export async function getSelectUnitOfMeasure(): Promise<AsyncSelectItem[]> {
  return Object.keys(DbUnitOfMeasure).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.unitOfMeasure." + elKey).toString(),
    };
  });
}
