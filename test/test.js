(function(global, undefined) {

    /** Group related tests */
    module('jQuery PasswordGenerator Plugin');

    /** Remove any duplicates from an array */
    function unique(x) {
        var bufValue = {};
        var filtered = x.filter(function(e) {
            var isUnique = false;
            if(typeof bufValue[e] === 'undefined') {
                isUnique = bufValue[e] = true;
            };
            return isUnique;
        });

        return filtered;
    };

    test('Generate new password', function(){
        var password = $.mkpasswd();

        equal(typeof password, 'string', 'new password a string.');
        notEqual(password, '', 'new password not empty.');
        ok(/^[0-9a-zA-Z]+$/.test(password), 'new password of alphanumeric characters.');
    });

    test('Default behavior', function(){
        var password = $.mkpasswd();
        equal(password.length, 8, 'new password of 8 characters.');

        var timesChallenge  = 1024;
        var variousPassword = (function() {
            var passwords = [];
            for (var i = 0; i < timesChallenge; i++) {
                var password = $.mkpasswd();
                passwords.push(password);
            };

            return passwords.join('');
        }) ();
        equal(variousPassword.length, (8 * timesChallenge), 'passwords of 8 characters(* times challenge).');
        ok(/[^I]/.test(variousPassword), 'Exclude "I" character.');
        ok(/[^l]/.test(variousPassword), 'Exclude "l" character.');
        ok(/[^1]/.test(variousPassword), 'Exclude "1" character.');
        ok(/[^O]/.test(variousPassword), 'Exclude "O" character.');
        ok(/[^0]/.test(variousPassword), 'Exclude "0" character.');
        ok(/[^q]/.test(variousPassword), 'Exclude "q" character.');
        ok(/[^9]/.test(variousPassword), 'Exclude "9" character.');
        ok(/[^c]/.test(variousPassword), 'Exclude "c" character.');
        ok(/[^o]/.test(variousPassword), 'Exclude "o" character.');
        ok(/[^v]/.test(variousPassword), 'Exclude "v" character.');
        ok(/[^y]/.test(variousPassword), 'Exclude "y" character.');
    });

    test('Randomness of the password', function(){
        var result = (function() {
            var validCharacters  = 62;
            var password         = $.mkpasswd({except: '', length: validCharacters});
            var uniqueCharacters = unique(password.split(''));
            var isNearlyRandom   = (uniqueCharacters.length > (validCharacters * 0.6))
            return isNearlyRandom;
        });
        ok(result, 'unique character with a probability of 60-100%');
    });

    test('Specified number of characters', function(){
        var repeat = 256;

        expect(repeat);

        for (var i = 1; i <= repeat; i++) {
            var password = $.mkpasswd({length: i});
            equal(password.length, i, 'new password of ' + i +' characters.');
        };
    });

    test('Except specified character', function(){
        var characters = '0123456789';
        var password   = $.mkpasswd({except: characters, length: 1024});

        ok(/[^0]/.test(password), 'Exclude a number "0".');
        ok(/[^1]/.test(password), 'Exclude a number "1".');
        ok(/[^2]/.test(password), 'Exclude a number "2".');
        ok(/[^3]/.test(password), 'Exclude a number "3".');
        ok(/[^4]/.test(password), 'Exclude a number "4".');
        ok(/[^5]/.test(password), 'Exclude a number "5".');
        ok(/[^6]/.test(password), 'Exclude a number "6".');
        ok(/[^7]/.test(password), 'Exclude a number "7".');
        ok(/[^8]/.test(password), 'Exclude a number "8".');
        ok(/[^9]/.test(password), 'Exclude a number "9".');
    });

    test('A collision-free password', function(){
        var stressTests = [
            {length:  4, maximumLoad:  256},
            {length:  8, maximumLoad: 1024},
            {length: 16, maximumLoad: 8192}
        ];
        $.each(stressTests, function() {
            var testLength  = this.length;
            var maximumLoad = this.maximumLoad;

            var result = (function() {
                var passwords = [];
                for (var i = 0; i < maximumLoad; i++) {
                    var password = $.mkpasswd({length: testLength});
                    passwords.push(password);
                };
                var uniqued = unique(passwords);

                return uniqued;
            }) ();
            equal(result.length, maximumLoad, 'password is ' + length + ' characters generates ' + maximumLoad + ' times');
        });
    });

    test('Invalid arguments will return a Not-A-Number', function() {
        expect(11 * 2);

        var invalidArguments = [
            {label: 'zero',     value: 0},
            {label: 'nearzero', value: 0.1},
            {label: 'minus',    value: -1},
            {label: 'null',     value: null},
            {label: 'NaN',      value: NaN},
            {label: 'false',    value: false},
            {label: 'empty',    value: ''},
            {label: 'string',   value: '1st'},
            {label: 'array',    value: [24, 42]},
            {label: 'object',   value: {number: 42}},
            {label: 'Infinity', value: Infinity}
        ];
        $.each(invalidArguments, function() {
            var password = $.mkpasswd({length: this.value});
            equal(typeof password, 'number', 'password a number: ' +  this.label);
            // IE does not support "Number.isNaN()"
            ok(isNaN(password), 'password a Not-A-Number: ' +  this.label);
        });
    });

    test('Trick arguments will return a password', function() {
        expect(4);

        var trickArguments = [
            {label: 'true',   value: true,  expected:  1},
            {label: 'array',  value: [42],  expected: 42},
            {label: 'string', value: '24',  expected: 24},
            {label: 'float',  value: '1.0', expected:  1}
        ];
        $.each(trickArguments, function() {
            var password = $.mkpasswd({length: this.value});
            equal(password.length, this.expected, 'new password: ' +  this.label);
        });
    });

    test('Round up the decimal.', function() {
        var password = $.mkpasswd({length: 42.0});
        equal(password.length, 42, 'round down ".0"');

        var password = $.mkpasswd({length: 42.1});
        equal(password.length, 43, 'round up ".1"');

        var password = $.mkpasswd({length: 42.9});
        equal(password.length, 43, 'round up ".9"');
    });

    test('Appear equally of uppercase (Probability 1/100 or more)', function() {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        expect(26); // upper-case alphabetic characters

        var PARAMETER_OF_PROBABILITY = 100;

        for (var i = 0, l = characters.length; i < l; i++) {
            var testCharacter = characters.charAt(i);
            var occurrences   = 0;
            for (var j = 0; j < PARAMETER_OF_PROBABILITY; j++) {
                var password = $.mkpasswd({except: ''});
                if (password.indexOf(testCharacter) !== -1) {
                    ++occurrences;
                };
            };
            ok((occurrences > 0), 'occurrence character: ' + testCharacter);
        };
    });

    test('Appear equally of lowercase (Probability 1/100 or more)', function() {
        var characters = 'abcdefghijklmnopqrstuvwxyz';

        expect(26); // lower-case alphabetic characters

        var PARAMETER_OF_PROBABILITY = 100;

        for (var i = 0, l = characters.length; i < l; i++) {
            var testCharacter = characters.charAt(i);
            var occurrences   = 0;
            for (var j = 0; j < PARAMETER_OF_PROBABILITY; j++) {
                var password = $.mkpasswd({except: ''});
                if (password.indexOf(testCharacter) !== -1) {
                    ++occurrences;
                };
            };
            ok((occurrences > 0), 'occurrence character: ' + testCharacter);
        };
    });

    test('Appear equally of number (Probability 1/100 or more)', function() {
        var characters = '0123456789';

        expect(10); // number characters

        var PARAMETER_OF_PROBABILITY = 100;

        for (var i = 0, l = characters.length; i < l; i++) {
            var testCharacter = characters.charAt(i);
            var occurrences   = 0;
            for (var j = 0; j < PARAMETER_OF_PROBABILITY; j++) {
                var password = $.mkpasswd({except: ''});
                if (password.indexOf(testCharacter) !== -1) {
                    ++occurrences;
                };
            };
            ok((occurrences > 0), 'occurrence character: ' + testCharacter);
        };
    });
}) (this);
