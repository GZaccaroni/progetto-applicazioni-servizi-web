import Ajv from "ajv";
import addFormats from "ajv-formats";

import Identifiable from "./json/Identifiable.json";
import Product from "./json/Product.json";
import ProductKind from "./json/ProductKind.json";
import CreateProduct from "./json/CreateProduct.json"
import UpdateProduct from "./json/UpdateProduct.json";
import CreateOrderEntry from "./json/CreateOrderEntry.json";
import CreateOrder from "./json/CreateOrder.json";
import UpdateOrder from "./json/UpdateOrder.json";
import Customer from "./json/Customer.json";
import CreateCustomer from "./json/CreateCustomer.json";
import UpdateCustomer from "./json/UpdateCustomer.json";

export const ajv=new Ajv();
addFormats(ajv)

ajv.addSchema(Identifiable, "Id");
ajv.addSchema(ProductKind,"ProductKind");
ajv.addSchema(Product, "Product");
ajv.addSchema(CreateProduct,"CreateProduct")
ajv.addSchema(UpdateProduct, "UpdateProduct");
ajv.addSchema(CreateOrderEntry, "CreateOrderEntry");
ajv.addSchema(CreateOrder,"CreateOrder");
ajv.addSchema(UpdateOrder, "UpdateOrder");
ajv.addSchema(Customer,"Customer");
ajv.addSchema(CreateCustomer,"CreateCustomer");
ajv.addSchema(UpdateCustomer,"UpdateCustomer");

export function validateRequest<T>(key:string, reqBody:string):Promise<T> | boolean{
  const validate= ajv.getSchema<T>(key);
  return validate(reqBody);
}