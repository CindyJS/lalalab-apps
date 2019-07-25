export default class AppMenu {
  constructor(props) {
    this.$element = null;
    this.props = props;
  }

  render() {
    const { appButtons } = this.props;
    this.$element = $('<div class="menu-main"></div>');
    const buttonsPerRow = this.layout();

    let currApp = 0;
    for (let i = 0; i !== buttonsPerRow.length; i += 1) {
      const newRow = $('<div class="menu-main-row"></div>');
      newRow.addClass(`menu-main-row-${Math.max(...buttonsPerRow)}`);
      for (let j = 0; j !== buttonsPerRow[i]; j += 1) {
        newRow.append(appButtons[currApp].render());
        currApp += 1;
      }
      this.$element.append(newRow);
    }

    return this.$element;
  }

  /**
   * Returns the row layout to use for app icons
   *
   * The layout is returned as an array where each item
   * is the number of icons to place in each row
   *
   * The distribution is calculated unless the configuration file specifies it explicitly.
   *
   * @return {Array}
   */
  layout() {
    const itemsPerRow = [];
    const { appButtons, buttonsPerRow, maxIconsPerRow } = this.props;
    const itemCount = appButtons.length;

    // If there's an applicable layout in the configuration, use it
    if (buttonsPerRow &&
      Array.isArray(buttonsPerRow) &&
      buttonsPerRow.length <= 3 &&
      buttonsPerRow.reduce((sum, a) => sum + a) === itemCount &&
      Math.max.apply(null, buttonsPerRow) <= maxIconsPerRow
    ) {
      return buttonsPerRow;
    }

    // Hardwired handling
    if (itemCount <= 18 && maxIconsPerRow === 6) {
      return AppMenu.itemsPerRow6(itemCount);
    }

    const rowCount = Math.ceil(itemCount / maxIconsPerRow);
    let remainingItems = appButtons.length;
    for (let i = 0; i !== rowCount; i += 1) {
      const itemsInRow = Math.ceil(remainingItems / (rowCount - i));
      itemsPerRow.push(itemsInRow);
      remainingItems -= itemsInRow;
    }

    return itemsPerRow;
  }


  /**
   * Returns the number of icons to place per row
   *
   * The values are hardcoded and this function only works
   * for 1-18 items
   *
   * @param {number} itemCount
   *  Number of app icons to lay out
   * @return {array}
   */
  static itemsPerRow6(itemCount) {
    const layouts = {
      1: [1],
      2: [2],
      3: [3],
      4: [4],
      5: [5],
      6: [6],
      7: [4, 3],
      8: [4, 4],
      9: [5, 4],
      10: [5, 5],
      11: [6, 5],
      12: [6, 6],
      13: [4, 5, 4],
      14: [5, 4, 5],
      15: [5, 5, 5],
      16: [5, 6, 5],
      17: [6, 5, 6],
      18: [6, 6, 6],
    };

    return layouts[itemCount];
  }
}
