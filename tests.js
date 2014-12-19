// Tests for flagman

var flagman = require('./flagman.js'),
    assert = require('assert');

var tests = {
    testNormal: function() {
        var flags, args, parsed;
        flags = {
            '-flag' : {
                'default': 'true',
                'validOptions': ['true','false']
            }
        };
        args = [];
        parsed = flagman(flags, true, args);
        if (parsed.flag !== 'true')
            return "-flag didn't get default option, got " + parsed.flag;

        args = ['-flag', 'false'];
        parsed = flagman(flags, true, args);
        if (parsed.flag !== 'false')
            return "-flag not set correctly, got " + parsed.flag;

        args = ['-flag=false'];
        parsed = flagman(flags, true, args);
        if (parsed.flag !== 'false')
            return "-flag=false is not false, got " + parsed.flag;

        // invalid arg should reset to default
        args = ['-flag', 'INVALID'];
        parsed = flagman(flags, true, args);
        if (parsed.flag !== 'true')
            return "invalid option not ignored, got " + parsed.flag;
        return true;
    },

    testBool: function() {
        // setting empty validOptions means that we only check whether flag exists
        var flags, args, parsed;
        flags = {
            '-bool' : {
                'validOptions': [],
            }
        };
        args = [];
        parsed = flagman(flags, true, args);
        if (parsed.bool !== false)
            return "-bool did not get default, got " + parsed.bool;

        args = ['-bool'];
        parsed = flagman(flags, true, args);
        if (parsed.bool !== true)
            return "-bool is not true, got " + parsed.bool;
        return true;
     },

    testNoDefault: function() {
        var flags, args, parsed;
        flags = {
            '-nodef' : {
                'validOptions': ['true','false']
            }
        };
        args = [];
        parsed = flagman(flags, true, args);
        if (parsed.nodef !== undefined)
            return "nodef did not get default, got " + parsed.nodef;
        args = ['-nodef', 'false'];
        parsed = flagman(flags, true, args);
        if (parsed.nodef !== 'false')
            return "expected false, got " + parsed.nodef;
        args = ['-nodef', 'INVALID'];
        parsed = flagman(flags, true, args);
        if (parsed.nodef !== undefined)
            return "expected undefined, got " + parsed.nodef;
        return true;
    }
}

function runTests() {
    for (var t in tests) {
        if (tests.hasOwnProperty(t)) {
            console.log("Testing " + t + "...");
            assert.equal(true, tests[t]());
        }
    }
    console.log("All tests pass!");
}

runTests();
