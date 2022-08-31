import { findStore, findStores } from "@/repositories/StoreRepository";
import {
  AsyncSelectItem,
  FindSelectItemsInput,
} from "@/components/common/AsyncSelectTypes";
import i18n from "@/i18n";
import { NetworkStore } from "@common/model/network/NetworkStore";
import { QuantityUnitOfMeasure } from "@common/model/common/QuantityUnitOfMeasure";
import { findProduct, findProducts } from "@/repositories/ProductRepository";
import { findCustomer, findCustomers } from "@/repositories/CustomerRepository";
import { compact } from "lodash";
import { NetworkCustomer } from "@common/model/network/NetworkCustomer";
import { NetworkUser } from "@common/model/network/NetworkUser";
import { findUser, findUsers } from "@/repositories/UserRepository";
import { NetworkProduct } from "@common/model/network/NetworkProduct";
import { StoreAccessLevel } from "@common/model/common/StoreAccessLevel";
import { ChartDataType } from "@common/model/common/ChartDataType";
import { ProductGrade } from "@common/model/common/ProductGrade";

const selectMaxItems = 10;
export const PRODUCT_KIND_IDENTIFIER_SEPARATOR = "_$_";

export async function getSelectStores(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<NetworkStore>[]> {
  let items: NetworkStore[];
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
): Promise<AsyncSelectItem<NetworkUser>[]> {
  let items: NetworkUser[];
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
): Promise<AsyncSelectItem<NetworkCustomer>[]> {
  let items: NetworkCustomer[];
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
  unitOfMeasure: QuantityUnitOfMeasure;
  pricePerUnit?: number;
}
export async function getSelectProductKinds(
  input?: FindSelectItemsInput
): Promise<AsyncSelectItem<SelectProductKind>[]> {
  const idSeparator = PRODUCT_KIND_IDENTIFIER_SEPARATOR;
  let items: NetworkProduct[];
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
  AsyncSelectItem<StoreAccessLevel>[]
> {
  return Object.values(StoreAccessLevel).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.store.accessLevel." + elKey).toString(),
      item: elKey,
    };
  });
}
export async function getSelectUnitOfMeasure(): Promise<
  AsyncSelectItem<QuantityUnitOfMeasure>[]
> {
  return Object.values(QuantityUnitOfMeasure).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.unitOfMeasure." + elKey).toString(),
      item: elKey,
    };
  });
}
export async function getSelectProductGrade(): Promise<
  AsyncSelectItem<ProductGrade>[]
> {
  return Object.values(ProductGrade).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.productGrade." + elKey).toString(),
      item: elKey,
    };
  });
}
export async function getSelectChartDataType(): Promise<
  AsyncSelectItem<ChartDataType>[]
> {
  return Object.values(ChartDataType).map((elKey) => {
    return {
      id: elKey,
      text: i18n.t("model.chartDataType." + elKey).toString(),
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
