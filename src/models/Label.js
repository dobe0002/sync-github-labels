class Label {
  constructor(obj = {}) {
    this.labelName = obj.name || '';
    this.labelNewName = obj.new_name || '';
    this.labelColor = obj.color || null;
    this.labelDescription = obj.description || null;
    this.umn = obj.umn || false;
  }

  set isUmn(bool) {
    this.umn = bool;
  }

  get newName() {
    return this.labelNewName;
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
    // TODO when UMN is updated to 2.19, the first if/else will need to be removed
    const obj = {};

    if (this.color !== null) {
      obj.color = this.color;
    }
    if (this.description !== null) {
      obj.description = this.description;
    }

    if (this.umn === true && this.labelNewName !== '') {
      obj.name = this.labelNewName;
    } else {
      if (this.labelNewName !== '') {
        obj.new_name = this.labelNewName;
      }
      obj.name = this.labelName;
    }

    return obj;
  }

  get toObjectForAdd() {
    const obj = this.toObject;
    if (!obj.color) {
      obj.color = 'ffffff';
    }
    return obj;
  }
}

module.exports = Label;
