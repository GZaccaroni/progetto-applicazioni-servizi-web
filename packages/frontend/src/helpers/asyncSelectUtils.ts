import { findStore, findStores } from "@/repositories/StoreRepository";
import {
  AsyncSelectItem,
  FindSelectItemsInput,
} from "@/components/common/AsyncSelectTypes";
import i18n from "@/i18n";
import { DbStore, DbStoreAccessLevel } from "@/model/db/DbStore";
import { DbUnitOfMeasure } from "@/model/db/DbUnitOfMeasure";
import { findProduct, findProducts } from "@/repositories/ProductRepository";
import { findCustomer, findCustomers } from "@/repositories/CustomerRepository";
import { compact } from "lodash";
import { DbCustomer } from "@/model/db/DbCustomer";
import { DbUser } from "@/model/db/DbUser";
import { findUser, findUsers } from "@/repositories/UserRepository";
import { DbProduct, DbProductGrade } from "@/model/db/DbProduct";

const selectMaxItems = 10;
export const PRODUCT_KIND_IDENTIFIER_SEPARATOR = "_$_";

export async function getSelectStores(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<DbStore>[]> {
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
      item: el,
    };
  });
}
export async function getSelectUsers(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<DbUser>[]> {
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
      item: el,
    };
  });
}
export async function getSelectCustomers(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<DbCustomer>[]> {
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
      item: el,
    };
  });
}
export interface SelectProductKind {
  productId: string;
  variantId?: string;
  unitOfMeasure: DbUnitOfMeasure;
  pricePerUnit?: number;
}
export async function getSelectProductKinds(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<SelectProductKind>[]> {
  const idSeparator = PRODUCT_KIND_IDENTIFIER_SEPARATOR;
  let items: DbProduct[];
  if (input?.ids != undefined) {
    const mappedIds = input.ids.map((id) => id.split(idSeparator)[0]);
    items = await findAll(mappedIds, findProduct);
  } else {
    items = (
      await findProducts({
        searchName: input?.query,
        limit: selectMaxItems,
      })
    ).results;
  }
  return items.flatMap((el) => {
    const kinds = new Array<AsyncSelectItem<SelectProductKind>>();
    kinds.push({
      id: el.id,
      text: el.name,
      item: {
        productId: el.id,
        unitOfMeasure: el.unitOfMeasure,
        pricePerUnit: el.pricePerUnit,
      },
    });
    kinds.push(
      ...el.kinds.map((kind) => {
        return {
          id: el.id + idSeparator + kind.id,
          text: el.name + " " + kind.name,
          item: {
            productId: el.id,
            variantId: kind.id,
            pricePerUnit: kind.pricePerUnit ?? el.pricePerUnit,
            unitOfMeasure: el.unitOfMeasure,
          },
        };
      })
    );
    return kinds;
  });
}
export async function getSelectStoreAccessLevel(): Promise<
  AsyncSelectItem<DbStoreAccessLevel>[]
> {
  return Object.values(DbStoreAccessLevel).map((elKey) => {
    return {
      id: elKey,
      text: i18n
        .t("model.store.accessLevel." + DbStoreAccessLevel[elKey])
        .toString(),
      item: elKey,
    };
  });
}
export async function getSelectUnitOfMeasure(): Promise<
  AsyncSelectItem<DbUnitOfMeasure>[]
> {
  return Object.values(DbUnitOfMeasure).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.unitOfMeasure." + DbUnitOfMeasure[elKey]).toString(),
      item: elKey,
    };
  });
}
export async function getSelectProductGrade(): Promise<
  AsyncSelectItem<DbProductGrade>[]
> {
  return Object.values(DbProductGrade).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.productGrade." + DbProductGrade[elKey]).toString(),
      item: elKey,
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
