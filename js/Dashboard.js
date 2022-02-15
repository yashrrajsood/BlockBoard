const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "key" in eg "https://example.com/?key=some_value"
let TICKER_CODE = params.code; // "some_value"

document.title = TICKER_CODE + " | Blockboard";
window.onload = function what() {
  document.getElementById("titlePage").innerHTML = TICKER_CODE;
};
