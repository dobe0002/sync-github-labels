import Label from '../../../src/models/Label';

describe('Label Model Tests', () => {
  let label = {};
  beforeEach(() => {
    label = new Label();
  });
  test('Is instance of Label', () => {
    expect(label).toBeInstanceOf(Label);
  });
  test('Getters and setters', () => {
    expect(label.name).toBeFalsy();
    expect(label.color).toBeNull();
    expect(label.description).toBeNull();
    expect(label.umn).toBeFalsy();
    expect(label.newName).toEqual('');

    // TODO is this truly testing constructors ... would need to create a new label object
    label.name = 'my label';
    label.color = 'my color';
    label.description = 'my description';
    label.isUmn = true;

    expect(label.name).toEqual('my label');
    expect(label.color).toEqual('my color');
    expect(label.description).toEqual('my description');
    expect(label.umn).toBeTruthy();

    const expectObj = {
      name: 'my label',
      color: 'my color',
      description: 'my description'
    };
    expect(label.toObject).toEqual(expectObj);
  });
  test('To object without change', () => {
    const labelOptions = {
      name: 'my label',
      color: 'my color',
      description: 'my description'
    };
    label = new Label(labelOptions);

    const expected = {
      color: 'my color',
      description: 'my description',
      name: 'my label'
    };
    expect(label.toObject).toEqual(expected);
  });
  test('To object without change, UMN', () => {
    const labelOptions = {
      name: 'my label',
      color: 'my color',
      description: 'my description',
      umn: true
    };
    label = new Label(labelOptions);

    const expected = {
      color: 'my color',
      description: 'my description',
      name: 'my label'
    };
    expect(label.toObject).toEqual(expected);
  });

  test('To object non-UMN with change', () => {
    const labelOptions = {
      name: 'my label',
      color: 'my color',
      description: 'my description',
      new_name: 'my new label'
    };
    label = new Label(labelOptions);

    const expected = {
      color: 'my color',
      description: 'my description',
      new_name: 'my new label',
      name: 'my label'
    };
    expect(label.toObject).toEqual(expected);
  });

  test('To object UMN with change ', () => {
    const labelOptions = {
      name: 'my label',
      color: 'my color',
      description: 'my description',
      new_name: 'my new label',
      umn: true
    };
    label = new Label(labelOptions);

    const expected = {
      color: 'my color',
      description: 'my description',
      name: 'my new label'
    };
    expect(label.toObject).toEqual(expected);
  });

  test('To object when color or description are not set', () => {
    const labelOptions = {
      name: 'my label'
    };
    label = new Label(labelOptions);

    const expected = {
      name: 'my label'
    };
    expect(label.toObject).toEqual(expected);
  });
  test('To object add ', () => {
    const labelOptions = {
      name: 'my label',
      color: '123456',
      description: 'my description'
    };
    label = new Label(labelOptions);

    const expected = {
      name: 'my label',
      color: '123456',
      description: 'my description'
    };
    expect(label.toObjectForAdd).toEqual(expected);
  });
  test('To object add with color and description missing', () => {
    const labelOptions = {
      name: 'my label'
    };
    label = new Label(labelOptions);

    const expected = {
      name: 'my label',
      color: 'ffffff'
    };
    expect(label.toObjectForAdd).toEqual(expected);
  });
});
