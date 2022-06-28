import Ajv from "ajv";
import addFormats from "ajv-formats";

import Identifiable from "./json/Identifiable.json";
import Product from "./json/Product.json";
import ProductKind from "./json/ProductKind.json";
import UpdateProduct from "./json/UpdateProduct.json";

export const ajv=new Ajv();
addFormats(ajv)

ajv.addSchema(Identifiable, "Id");
ajv.addSchema(ProductKind,"ProductKind");
ajv.addSchema(Product, "Product");
ajv.addSchema(UpdateProduct, "UpdateProduct");

export function validateRequest<T>(key:string, reqBody:string):Promise<T> | boolean{
  const validate= ajv.getSchema<T>(key);
  return validate(reqBody);
}