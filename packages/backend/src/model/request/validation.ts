import Ajv from "ajv";
import addFormats from "ajv-formats";

import Identifiable from "./json_schema/Identifiable.json";
import Product from "./json_schema/Product.json";
import ProductKind from "./json_schema/ProductKind.json";
import CreateProduct from "./json_schema/CreateProduct.json"
import UpdateProduct from "./json_schema/UpdateProduct.json";
import CreateOrderEntry from "./json_schema/CreateOrderEntry.json";
import CreateOrder from "./json_schema/CreateOrder.json";
import UpdateOrder from "./json_schema/UpdateOrder.json";
import Customer from "./json_schema/Customer.json";
import CreateCustomer from "./json_schema/CreateCustomer.json";
import UpdateCustomer from "./json_schema/UpdateCustomer.json";
import StoreAuthorization from "./json_schema/StoreAuthorization.json";
import Store from "./json_schema/Store.json";
import CreateStore from "./json_schema/CreateStore.json";
import UpdateStore from "./json_schema/UpdateStore.json";
import User from "./json_schema/User.json";
import CreateUser from "./json_schema/CreateUser.json";
import UpdateUser from "./json_schema/UpdateUser.json";
import PaginateParams from "./json_schema/PaginateParams.json";
import FilterByName from "./json_schema/FilterByName.json";
import FilterByDate from "./json_schema/FilterByDate.json";
import FilterByStore from "./json_schema/FilterByStore.json";
import GetProducts from "./json_schema/GetProducts.json";
import GetOrders from "./json_schema/GetOrders.json";

export const ajv=new Ajv();
addFormats(ajv)

ajv.addSchema(Identifiable, "Identifiable");
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
ajv.addSchema(StoreAuthorization, "StoreAuthorization");
ajv.addSchema(Store,"Store");
ajv.addSchema(CreateStore,"CreateStore");
ajv.addSchema(UpdateStore,"UpdateStore");
ajv.addSchema(User,"User");
ajv.addSchema(CreateUser, "CreateUser");
ajv.addSchema(UpdateUser,"UpdateUser");
ajv.addSchema(PaginateParams,"PaginateParams");
ajv.addSchema(FilterByName,"FilterByName");
ajv.addSchema(FilterByDate,"FilterByDate");
ajv.addSchema(FilterByStore,"FilterByStore");
ajv.addSchema(GetProducts,"GetProducts");
ajv.addSchema(GetOrders,"GetOrders");

export function validateRequest<T>(key:string, reqBody:string):Promise<T> | boolean{
  const validate= ajv.getSchema<T>(key);
  return validate(reqBody);
}