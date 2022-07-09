import { findStore, findStores } from "@/repositories/StoreRepository";
import {
  AsyncSelectItem,
  FindSelectItemsInput,
} from "@/components/common/AsyncSelect.vue";
import i18n from "@/i18n";
import { DbStore, DbStoreAccessLevel } from "@/model/db/DbStore";
import { DbUnitOfMeasure } from "@/model/db/DbUnitOfMeasure";
import { findProducts } from "@/repositories/ProductRepository";
import { findCustomer, findCustomers } from "@/repositories/CustomerRepository";
import { compact } from "lodash";
import { DbCustomer } from "@/model/db/DbCustomer";
import { DbUser } from "@/model/db/DbUser";
import { findUser, findUsers } from "@/repositories/UserRepository";

const selectMaxItems = 10;
export async function getSelectStores(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem[]> {
  let items: DbStore[];
  if (input?.ids != undefined) {
    items = await findAll(input.ids, findStore);
  } else {
    items = (
      await findStores({
        authorized: true,
        searchName: input?.query,
        limit: selectMaxItems,
      })
    ).results;
  }
  return items.map((el) => {
    return {
      id: el.id,
      text: el.name,
    };
  });
}
export async function getSelectUsers(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem[]> {
  let items: DbUser[];
  if (input?.ids != undefined) {
    items = await findAll(input.ids, findUser);
  } else {
    items = (
      await findUsers({
        searchName: input?.query,
        limit: selectMaxItems,
      })
    ).results;
  }
  return items.map((el) => {
    return {
      id: el.id,
      text: el.username,
    };
  });
}
export async function getSelectCustomers(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem[]> {
  let items: DbCustomer[];
  if (input?.ids != undefined) {
    items = await findAll(input.ids, findCustomer);
  } else {
    items = (
      await findCustomers({
        searchName: input?.query,
        limit: selectMaxItems,
      })
    ).results;
  }
  return items.map((el) => {
    return {
      id: el.id,
      text: el.name,
    };
  });
}
export async function getSelectProductKind(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findProducts({
    searchName: input?.query,
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

async function findAll<Item>(
  ids: string[],
  findItemFn: (id: string) => Promise<Item>
): Promise<Item[]> {
  const promises = ids.map((id) => findItemFn(id));

  const result = await Promise.allSettled(promises);

  return compact(
    result.map((el) => (el.status == "fulfilled" ? el.value : undefined))
  );
}
