module.exports = {
  'src/**/*.{js,jsx}': [
    jsFiles => jsFiles.map(jsFile => `npm run lint ${jsFile}`) // check file
  ]
};
