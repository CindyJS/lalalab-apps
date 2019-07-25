export default class BrowserHelper {
  /**
   * Gets the query string
   * @return {object} map of query string parameters
   */
  static getQueryString() {
    const pl = /\+/g;  // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = (s => decodeURIComponent(s.replace(pl, ' ')));
    const query = window.location.search.substring(1);

    const urlParams = {};
    let match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }

    return urlParams;
  }

  /**
   * Disables default dragging of a DOM Element
   *
   * The normal behavior of browsers is that DOM Elements can be dragged as translucent
   * copies of their content. This function disables this behavior for a single element.
   *
   * @param {jQuery|JQuery} $element
   */
  static disableDrag($element) {
    $element.on('dragstart', () => false);
  }
}
