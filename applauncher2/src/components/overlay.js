export default class Overlay {
  constructor(props) {
    this.$element = null;
    this.props = props;
    this.$container = null;
    this.visible = false;
  }

  render() {
    this.$element = $("<div class='overlay'></div>");
    this.$element.append($("<div class='overlay-background'></div>"));
    this.$container = $("<div class='overlay-container'></div>");
    this.$element.append(this.$container);

    return this.$element;
  }

  show(content) {
    this.visible = true;
    $('body').addClass('overlay-visible');
    this.$container.append(content);
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  close() {
    $('body').removeClass('overlay-visible');
    this.$container.empty();
    this.visible = false;
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}
