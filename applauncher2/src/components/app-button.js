import BrowserHelper from '../helpers/browser-helper';

export default class AppButton {
  constructor(props) {
    this.$element = null;
    this.props = props;
    this.$nameContainer = null;
  }

  setName(name) {
    if (this.$nameContainer) {
      this.$nameContainer.html(name);
    }
  }

  setInitializing() {
    this.$element.removeClass('running');
    this.$element.addClass('initializing');
  }

  setStarted() {
    this.$element.removeClass('initializing');
    this.$element.addClass('running');
  }

  setClosed() {
    this.$element.removeClass('running');
  }

  render() {
    const { appID, name, icon, onClick } = this.props;
    this.$element = $('<a href="#" class="button menu-main-button"></a>')
      .attr('data-app-id', appID)
      .on('click', () => { onClick(appID); });

    this.$element.append($(`<img src="${icon}" class="icon"></div>`)
      .on('error', (ev) => { ev.target.src = 'assets/img/icon_fallback.png'; }));

    this.$nameContainer = $(`<div class="name">${name}</div>`);
    this.$element.append(this.$nameContainer);

    BrowserHelper.disableDrag(this.$element);

    return this.$element;
  }
}
