const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
};

/**
 * Fetch any API
 * @param {String} url api endpoint
 * @param {Object} params params to pass
 * @param {String} method request method. Default as get
 */
export const fetchApi = async ({ queryKey }) => {
  const [, { url, params, method = "GET" }] = queryKey;
  let _url = url;
  // Create a new AbortController instance for this request
  const controller = new AbortController();
  // Get the abortController's signal
  const signal = controller.signal;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  };

  // if params exists and method is GET, add query string to url
  // otherwise, just add params as a "body" property to the options object
  if (params) {
    if (method === "GET") {
      _url += "?" + objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params); // body should match Content-Type in headers option
    }
  }

  const promise = fetch(_url, options).then((response) => response.json());

  // Cancel the request if React Query calls the `promise.cancel` method
  promise.cancel = controller.abort;
  return promise;
};
