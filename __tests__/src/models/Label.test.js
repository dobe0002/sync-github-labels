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
    expect(label.color).toBeFalsy();
    expect(label.description).toBeFalsy();
    expect(label.isUMN).toBeFalsy();
    expect(label.labelNewName).toEqual('');

    // TODO is this truly testing constructors ... would need to create a new label object
    label.name = 'my label';
    label.color = 'my color';
    label.description = 'my description';

    expect(label.name).toEqual('my label');
    expect(label.color).toEqual('my color');
    expect(label.description).toEqual('my description');

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
});
