export default class AppArea {
  constructor() {
    this.$element = null;
  }

  render() {
    this.$element = $('<div class="appContainer"></div>');

    return [
      $('<div class="appPane"></div>'),
      this.$element,
    ];
  }

  getContainer() {
    return this.$element[0];
  }

  clear() {
    this.$element.empty();
  }
}
