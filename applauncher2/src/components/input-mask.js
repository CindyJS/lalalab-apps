export default class InputMask {
  constructor() {
    this.$element = null;
  }

  disableUserInput() {
    if (this.$element !== null) {
      this.$element.show();
    }
  }

  enableUserInput() {
    if (this.$element !== null) {
      this.$element.hide();
    }
  }

  render() {
    this.$element = $('<div class="inputmask"></div>');
    this.enableUserInput();

    return this.$element;
  }
}
