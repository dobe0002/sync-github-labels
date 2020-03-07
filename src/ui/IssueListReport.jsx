/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

const IssueListReport = props => {
  /* *********************************************** */
  const labelInfo = label => {
    return (
      <div>
        <h2>Label: {label.name}</h2>
        <div>
          <p>Total uses: {label.total}</p>
          <p>
            Found in {label.repos} out of {label.reposchecked} repos checked
          </p>
        </div>
      </div>
    );
  };
  /* *********************************************** */
  const issueInfo = issue => {
    return (
      <li>
        <a href={issue.url}>{issue.name}</a> (#
        {issue.number}) {issue.open !== true && 'CLOSED'}
      </li>
    );
  };

  /* *********************************************** */
  const repoInfo = repo => {
    return (
      <div>
        <h3>
          {repo.org}/{repo.name}
        </h3>
        <ul>{repo.issues.map(issue => issueInfo(issue))}</ul>
      </div>
    );
  };

  /* *********************************************** */
  const { reportjson } = props;
  return (
    <html lang='en'>
      <head>
        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
          integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh'
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <div className='container-fluid'>
          {labelInfo(reportjson.label)}
          {reportjson.repos.map(repo => repoInfo(repo))}
        </div>
      </body>
    </html>
  );
};

IssueListReport.propTypes = {
  reportjson: PropTypes.shape({
    label: PropTypes.object,
    repos: PropTypes.array
  })
};
IssueListReport.defaultProps = {
  reportjson: { label: { name: '', total: 0, repos: 0, reposchecked: 0 } }
};
export default IssueListReport;
