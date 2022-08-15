/**
 * Swagger Petstore
 * This is a sample Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).
 *
 * OpenAPI spec version: 1.0.0
 * Contact: apiteam@swagger.io
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ProductKind } from "./ProductKind";

export interface Product {
  name: string;
  pricePerUnit?: number;
  kinds: Array<ProductKind>;
  /**
   * Order Status
   */
  unitOfMeasure: UnitOfMeasureEnum;
}

export type UnitOfMeasureEnum = "kilogram" | "piece";
export const UnitOfMeasureEnum = {
  Kilogram: "kilogram" as UnitOfMeasureEnum,
  Piece: "piece" as UnitOfMeasureEnum,
};
