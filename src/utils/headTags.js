export function headTags(tags) {
  if (typeof NODE_ENV === "boolean" && NODE_ENV) {
    throw {
      ...tags,
      headTag: true,
    };
  }
}
