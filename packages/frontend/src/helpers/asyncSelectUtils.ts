import { findStores } from "@/repositories/StoreRepository";
import { AsyncSelectItem } from "@/components/common/AsyncSelect.vue";

const selectMaxItems = 10;
export async function getSelectStoreItems(
  query: string
): Promise<AsyncSelectItem[]> {
  const paginatedResult = await findStores({
    authorized: true,
    searchName: query,
    limit: selectMaxItems,
  });
  console.log("Results ", paginatedResult);
  return paginatedResult.results.map((el) => {
    return {
      id: el.id,
      text: el.name,
    };
  });
}
