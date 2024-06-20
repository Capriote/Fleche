import ObjectID from "bson-objectid";

export function createID(prefix?: string) {
  const id = ObjectID().toHexString();

  if (prefix) {
    return `${prefix}-${id}`;
  }

  return id;
}
