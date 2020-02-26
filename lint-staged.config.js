module.exports = {
  '{src,__tests__}/**/*.{js,jsx}': [
    jsFiles => jsFiles.map(jsFile => `npm run lint ${jsFile}`)
  ]
};
