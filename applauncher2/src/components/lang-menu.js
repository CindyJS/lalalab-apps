import languages from 'languages';
import { countries } from 'countries-list';
import BrowserHelper from '../helpers/browser-helper';

export default class LangMenu {
  constructor(props) {
    this.$element = null;
    this.props = props;
  }

  render() {
    const { items, onSelect } = this.props;
    this.$element = $("<ul class='menu-lang'></ul>");

    // Count the regional variations of each language
    const variations = {};
    for (const langCode of items) {
      const langCodeParts = langCode.split('-');
      variations[langCodeParts[0]] = (variations[langCodeParts[0]] || 0) + 1;
    }

    // Build the menu
    for (const langCode of items) {
      const langCodeParts = langCode.split('-');
      let itemText;
      // Handle xx-xx and xx language codes separately
      if (langCodeParts.length === 2) {
        // For xx-xx languages we only show the country name if there
        // is more than one variation of the language active in the configuration
        const languageName =
          languages.getLanguageInfo(langCodeParts[0]).nativeName || langCodeParts[0];
        if (variations[langCodeParts[0]] > 1) {
          const countryName =
            (countries[langCodeParts[1].toUpperCase()] &&
              countries[langCodeParts[1].toUpperCase()].native) || langCodeParts[1];
          itemText = `${languageName} (${countryName})`;
        } else {
          itemText = languageName;
        }
      } else {
        itemText = languages.getLanguageInfo(langCode).nativeName;
      }

      const $item = $('<li></li>');
      const $link = $("<a href='#'></a>");
      $link.text(itemText);
      $link.on('click', () => onSelect(langCode));
      $item.append($link);
      this.$element.append($item);
    }

    BrowserHelper.disableDrag(this.$element);

    return this.$element;
  }
}
