import Logo from './logo';

export default class ImageLogo extends Logo {

  renderContent() {
    const { imgUrl } = this.props;
    this.$element.css('background-image', `url(${imgUrl})`);

    return null;
  }
}
