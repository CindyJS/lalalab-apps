import Logo from './logo';

export default class TextLogo extends Logo {
  constructor(props) {
    super(props);
    this.$logoText = null;
  }

  resize() {
    if (this.$logoText) {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.15;
      const newScale = Math.min(
        maxHeight / this.$logoText.outerHeight(),
        maxWidth / this.$logoText.outerWidth(),
        1
      );

      this.$logoText.css('transform', `scale(${newScale})`);
    }
  }

  renderContent() {
    const { text } = this.props;
    this.$logoText = $("<div class='logo-text'></div>").text(text);
    return $("<div class='logo-text-wrapper'></div>").append(this.$logoText);
  }
}
