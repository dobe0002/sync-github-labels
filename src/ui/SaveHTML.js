const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const Babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

class SaveHTML {
  static issueListHtml(json) {
    const fileContent = fs.readFileSync(
      './src/ui/IssueListReport.jsx',
      'utf-8'
    );
    const { code } = Babel.transform(fileContent, {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      comments: false,
      minified: true
    });

    const props = { text: 'Kim', reportjson: json };
    // eslint-disable-next-line no-eval
    const component = React.createElement(eval(code), { ...props });
    const html = renderToStaticMarkup(component);

    try {
      fs.mkdirSync(path.join(__dirname, '../../reports'));
      // eslint-disable-next-line no-empty
    } catch (err) {
    } finally {
      fs.writeFileSync(
        path.join(__dirname, `../../reports/issueList-${Date.now()}.html`),
        html
      );
    }

    return html;
  }
}
module.exports = SaveHTML;
