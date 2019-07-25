import BrowserHelper from '../helpers/browser-helper';

export default class Logo {
  constructor(props) {
    this.$element = null;
    this.props = props;
  }

// eslint-disable-next-line class-methods-use-this
  renderContent() {
    throw new Error('Must override the Logo.renderContent method.');
  }

// eslint-disable-next-line class-methods-use-this
  resize() {

  }

  render() {
    const { onClick } = this.props;
    this.$element = $("<a href='#' class='logo'></a>")
      .on('click', onClick);

    this.$element.append(this.renderContent());

    BrowserHelper.disableDrag(this.$element);
    return this.$element;
  }
}
