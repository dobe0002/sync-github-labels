/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import IssueListReport from '../../../src/ui/IssueListReport';
import sampleProps from '../../../__fixtures__/issueListProps';

configure({ adapter: new Adapter() });

const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

describe('Issue List Report test', () => {
  test('Accessibility check', async () => {
    const wrapper = shallow(<IssueListReport reportjson={sampleProps} />);
    const results = await axe(wrapper.html());
    // console.log('Axe violations', results.violations);
    expect(results).toHaveNoViolations();
    // console.log(wrapper.html());
  });
  test('Snapshot test', () => {
    const wrapper = shallow(<IssueListReport reportjson={sampleProps} />);
    expect(wrapper.find('.repo')).toHaveLength(3);
    expect(wrapper.find('.issue')).toHaveLength(3);
    expect(wrapper).toMatchSnapshot();
  });
});
