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
});
