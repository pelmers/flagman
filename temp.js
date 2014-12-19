var args = require('./flagman.js')({
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
});

