class Label {
  constructor(obj = {}) {
    this.labelName = obj.name || '';
    this.labelColor = obj.color || '';
    this.labelDescription = obj.description || '';
  }

  get name() {
    return this.labelName;
  }

  set name(name) {
    this.labelName = name;
    return this.labelName;
  }

  get color() {
    return this.labelColor;
  }

  set color(color) {
    this.labelColor = color;
    return this.labelColor;
  }

  get description() {
    return this.labelDescription;
  }

  set description(descr) {
    this.labelDescription = descr;
    return this.labelDescription;
  }

  get toObject() {
    return {
      color: this.color,
      name: this.name,
      description: this.description
    };
  }
}

module.exports = Label;
