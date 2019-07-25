import BrowserHelper from '../helpers/browser-helper';

export default class UtilBar {
  constructor(props) {
    this.$element = null;
    this.$titlePane = null;
    this.props = props;
  }

  /**
   * Sets the title and makes it visible
   *
   * @param {string} aTitle
   */
  displayTitle(aTitle) {
    this.$titlePane.text(aTitle);
    this.$titlePane.addClass('visible');
  }

  /**
   * Hides the title
   */
  hideTitle() {
    this.$titlePane.removeClass('visible');
  }

  render() {
    this.$element = $('<div class="util-bar"></div>');
    const { langMenuShow, infoAppShow, onLangButton, onInfoButton, onBackButton } = this.props;

    // Language menu
    if (langMenuShow) {
      this.$element.append(
        $("<a class='util-button util-button-lang' href='#'><span class='fa fa-language'></span></a>")
          .on('click', onLangButton)
      );
    }

    // Info button
    if (infoAppShow) {
      this.$element.append(
        $("<a class='util-button util-button-info' href='#'><span class='fa fa-info-circle'></span></a>")
          .on('click', onInfoButton)
      );
    }

    // Close button
    this.$element.append(
      $("<a class='util-button util-button-close' href='#'><span class='fa fa-arrow-left'></span></a>")
        .on('click', onBackButton)
    );

    this.$titlePane = $('<div class="titlePane"></div>');

    this.$element.append(this.$titlePane);

    BrowserHelper.disableDrag(this.$element);

    return this.$element;
  }
}
