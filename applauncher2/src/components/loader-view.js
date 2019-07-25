export default class LoaderView {

  constructor() {
    this.$element = null;
    this.$progressBar = null;
    this.$errors = null;

    this.progress = 0;
  }

  setProgress(progress) {
    this.progress = progress;
    this.$progressBar.css({ width: `${this.progress * 100}%` });
  }

  showError(text) {
    if (this.$errors === null) {
      this.$errors = $("<div class='loader-errors'></div>");
      this.$errors.append(
        $("<i class='loader-errors-icon fa fa-exclamation-triangle' aria-hidden=\"true\"></i>")
      );
      this.$element.append(this.$errors);
    }

    this.$errors.append(
      $("<div class='loader-errors-item'></div>").html(text)
    );
  }

  render() {
    this.$element = $("<div class='loader' />");

    this.$progressBar = $("<div class='loader-progress'></div>");
    this.$element.append(this.$progressBar);

    this.setProgress(this.progress);

    return this.$element;
  }
}
