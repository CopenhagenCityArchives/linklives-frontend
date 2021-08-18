export function URIQueryToObj(query) {
  const result = {};

  const keyValuePairs = query.split("&");

  keyValuePairs.forEach((keyValuePair) => {
    const [ key, value ] = keyValuePair.split("=");
    const cleanedKey = decodeURIComponent(key);

    result[cleanedKey] = decodeURIComponent(value);

    if(typeof value === "undefined") {
      result[cleanedKey] = true;
    }
  });

  return result;
}
