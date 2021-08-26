export function getObjectFromQueryString(query) {
  const result = {};

  const keyValuePairs = query.split("&");

  keyValuePairs.forEach((keyValuePair) => {
    const [ key, value ] = keyValuePair.split("=");
    const cleanedKey = decodeURIComponent(key);

    if(typeof value === "undefined") {
      result[cleanedKey] = true;
      return;
    }

    result[cleanedKey] = decodeURIComponent(value);
  });

  return result;
}
