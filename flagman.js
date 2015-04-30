// Read arguments to the program and create a mapping of args to values.
// Checks that all the options are valid.

function _in(elem, array) {
    // Return whether elem is strictly a member of array
    return array.some(function (el) {
        return elem === el;
    });
}

function any_in(elems, array) {
    // Return whether any of elems are in array
    return elems.some(function (el) {
        return _in(el, array);
    });
}

function getLongestKey(obj) {
    // Return the .length of the longest key in obj
    var maxL = 0;
    for (var k in obj)
        if (obj.hasOwnProperty(k))
            if (k.length > maxL)
                maxL = k.length;
    return maxL;
}

function generateUsage(flags, meta) {
    // Generate a usage string given some flag object.
    var options = "Options:",
        longestKey = getLongestKey(flags);
    if (meta && meta.description)
        options = meta.description + '\n' + options;
    for (var f in flags) {
        if (!flags.hasOwnProperty(f))
            continue;
        options += '\n  ';
        options += f;
        // pad the appropriate number of spaces
        for (var i = f.length; i < longestKey + 2; i++)
            options += ' ';
        if (flags[f].description)
            options += flags[f].description;
        if (flags[f].default)
            options += " Default: " + flags[f].default + ".";
        if (flags[f].validOptions)
            if (flags[f].validOptions.length !== 0)
                options += " Valid: " + flags[f].validOptions.toString();
        if (flags[f].validRegex)
            options += " Matches: " + flags[f].validRegex.toString();
    }
    return options;
}

function splitEquals(array) {
    // Split all elements on equals symbol (=)
    // [--something=flag] -> [--something, flag]
    // Does not modify the passed in array.
    var out = [];
    array.forEach(function (elem) {
        elem.split('=').forEach(function (e) {
            out.push(e);
        });
    });
    return out;
}

// export parsing function that returns a map, and usage generator
module.exports = function (flags, meta, quiet, args) {
    if (args === undefined)
        args = process.argv;
    if (any_in(['--help', '-h', '--usage'], args)) {
        console.log(generateUsage(flags, meta));
        return null;
    }
    args = splitEquals(args);
    var opts = {};
    for (var flag in flags) {
        if (!flags.hasOwnProperty(flag))
            continue;
        // strip leading - or -- to get something we can access as a prop
        var flagProp = flag.replace(/--?/, '');
        opts[flagProp] = flags[flag].default;
        // if the flag has no valid options, we only care whether it exists
        if (flags[flag].validOptions !== undefined &&
            flags[flag].validOptions.length === 0) {
            opts[flagProp] = _in(flag, args);
            continue;
        }
        // otherwise we look at the next element in args and test whether it
        // passes validOptions or validRegex, then set it to flags[flag]
        if (_in(flag, args)) {
            var nextArg = args[args.indexOf(flag) + 1];
            if (flags[flag].validOptions !== undefined) {
                if (_in(nextArg, flags[flag].validOptions))
                    opts[flagProp] = nextArg;
                else if (!quiet)
                    console.log("Argument " + nextArg + " to " + flag + " not in ["
                        + flags[flag].validOptions.toString() + "], skipping...");
            } else if (flags[flag].validRegex !== undefined) {
                if (flags[flag].validRegex.test(nextArg))
                    opts[flagProp] = nextArg;
                else if (!quiet)
                    console.log("Argument " + nextArg + " to " + flag + " did not match "
                        + flags[flag].validRegex.toString() + ", skipping...");
            } else {
                opts[flagProp] = nextArg;
            }
        }
    }
    return opts;
};
