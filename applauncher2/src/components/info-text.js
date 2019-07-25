import BrowserHelper from '../helpers/browser-helper';

export default class InfoText {
  constructor(props) {
    this.$element = null;
    this.props = props;
  }

// eslint-disable-next-line class-methods-use-this
  resize() {

  }

  render() {
    const { text } = this.props;

    if (text.lenght === 0) {
      return null;
    }

    this.$element = $("<div class='info-text'></div>")
      .html(text);
    BrowserHelper.disableDrag(this.$element);
    return this.$element;
  }
}
