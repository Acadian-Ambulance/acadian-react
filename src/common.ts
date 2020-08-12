const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:Z|(\+|-)([\d|:]*))?$/;

/**
 * Parses ISO date strings as Date objects when passed as the second argument to JSON.parse().
 * https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
 */
const dateParser = function (key: string, value: any) {
  if (typeof value === 'string') {
    const a = reISO.exec(value);
    if (a) {
      return new Date(value);
    }
  }
  return value;
};

/**
 * Like fetch, but parses successful response text to JSON (cast to T) and unsuccessful response text is thrown as an
 * Error.
 */
export async function fetchJson<T>(input: RequestInfo, init?: RequestInit | undefined) {
  const response = await fetch(input, init);
  const text = await response.text();
  if (response.ok) {
    return JSON.parse(text, dateParser) as Promise<T>;
  } else {
    throw new Error(text);
  }
}