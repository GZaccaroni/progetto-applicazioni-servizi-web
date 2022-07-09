import { findStores } from "@/repositories/StoreRepository";
import { AsyncSelectItem } from "@/components/common/AsyncSelect.vue";
import { findUsers } from "@/repositories/UserRepository";
import i18n from "@/i18n";
import { DbStoreAccessLevel } from "@/model/db/DbStore";
import { DbUnitOfMeasure } from "@/model/db/DbUnitOfMeasure";
import { findProducts } from "@/repositories/ProductRepository";
import {findCustomers} from "@/repositories/CustomerRepository";

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
export async function getSelectCustomers(
  query: string
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findCustomers({
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
export async function getSelectProductKind(
  query: string
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findProducts({
    searchName: query,
    limit: selectMaxItems,
  });
  return paginatedResult.results.flatMap((el) => {
    const kinds = new Array<AsyncSelectItem>();
    kinds.push({
      id: el.id,
      text: el.name,
    });
    kinds.push(
      ...el.kinds.map((kind) => {
        return {
          id: el.id + "_" + kind.id,
          text: el.name + " " + kind.name,
        };
      })
    );
    return kinds;
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
