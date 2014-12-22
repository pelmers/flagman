[flagman.js](https://www.npmjs.com/package/flagman)
------------

Parse command flags and generate usage text.

Install: `npm install flagman`

Test: `npm test`

### Example usage:
```js
var args = require('flagman')({
    // Define flags here
    '--flag1': {
        'default': 'Default',
        // args.flag1 will be 'Default' if the argument is not valid.
        'validOptions': ['Default', 'NotDefault']
    },
    '-bool': {
        // Empty validOptions means the flag is true/false depending on presence in args
        'validOptions': []
    },
    '--date': {
        'default': '2014-09-10',
        // Validate on regular expression
        'validRegex': /\d{4}-\d{2}-\d{2}/
    }
}, {
    description: "This is a description printed at the top of the help text."
});
```

Help text for the above:
```
This is a description printed at the top of the help text.
Options:
  --flag1   Default: Default. Valid: Default,NotDefault
  -bool
  --date    Default: 2014-09-10. Matches: /\d{4}-\d{2}-\d{2}/
```
