
module.exports = {
  "src/**/*.{js,jsx}": [
    // jsFiles => jsFiles.map(jsFile => `npm run lint:js ${jsFile}`) // check files
    //
    // Use the following 3 lines to attempt to fix and stage changes
    // jsFilesPrettier => jsFilesPrettier.map(jsFilePrettier => `npm run prettier:fix ${jsFilePrettier}`) ,// Prettier fix files
    // jsFilesEslint => jsFilesEslint.map(jsFileEslint => `npm run lint:js:fix ${jsFileEslint}`), // Eslint fix files
    // "git add"
    
  ],
  "src/**/*.{scss,css}": [
    // scssFiles => scssFiles.map(scssFile => `npm run lint:scss ${scssFile}`) // check files
    // 
    // Use the following 3 lines to attempt to fix and stage changes
    // scssFilesPrettier => scssFilesPrettier.map(scssFilePrettier => `npm run prettier:fix ${scssFilesPrettier}`) ,// Prettier fix files
    // scssFilesStyleLint => scssFilesStyleLint.map(scssFileStyleLint => `npm run lint:scss:fix ${scssFileStyleLint}`), // Stylelint fix files
    // "git add"
   
  ],
  "src/**/*.html": [
    htmlFiles => htmlFiles.map(htmlFile => `npm run prettier ${htmlFile}`) // check files
    //
    // Use the following 2 lines to attempt to fix and stage changes
    // htmlFiles => htmlFiles.map(htmlFile => `npm run prettier:fix ${htmlFile}`),// Prettier fix files
    // "git add"
  ]
};
