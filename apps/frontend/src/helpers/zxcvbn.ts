import { zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnItPackage from "@zxcvbn-ts/language-it";

export function setupZxcvbn() {
  const options = {
    translations: zxcvbnItPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnItPackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(options);
}
