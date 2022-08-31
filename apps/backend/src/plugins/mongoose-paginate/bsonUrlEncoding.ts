import { EJSON } from "bson";

import base64url from "base64-url";
/**
 * These will take a BSON object (an database result returned by the MongoDB library) and
 * encode/decode as a URL-safe string.
 */

const encode = function (obj: EJSON.SerializableTypes) {
  return base64url.encode(EJSON.stringify(obj));
};

const decode = function (str: string) {
  return EJSON.parse(base64url.decode(str));
};

export default { encode, decode };
