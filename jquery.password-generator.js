/**
 * jQuery PasswordGenerator Plugin
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function(global, $, undefined) {

    /**
     * generate new password.
     *
     * Usage:
     *
     * <code>
     * var password = (new PasswordGenerator({length: 8})).generate();
     * </code>
     *
     * @class PasswordGenerator
     * @property {Number} length The length of the password.
     * @property {String} except Except this character from the password.
     */
    var PasswordGenerator = (function() {

        PasswordGenerator.prototype.except = 'Il1O0q9covy';
        PasswordGenerator.prototype.length = 0;

        var SPECIES_CHARACTER = 'abcdefghijklmnopqrstuvwxyz'
                              + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                              + '0123456789';

        function rand(min, range) {
            var randomized = Math.random();
            var numbered   = ((randomized * (range - min + 1)) + min);
            var floored    = Math.floor(numbered);

            return floored;
        };

        /**
         * Constructer
         *
         * @constructor
         * @param {Object} The behavior of generator.
         *                 length: The length of the password.
         *                 except: Except this character from the password.
         */
        function PasswordGenerator(args) {
            var option = $.extend({
                except: null,
                length: null
            }, args || {});

            if (option.except !== null) {
                this.except = option.except;
            };
            if (option.length !== null) {
                this.length = option.length;
            };
        };

        /**
         * generate new password.
         * 
         * @return {String} a new password.
         */
        PasswordGenerator.prototype.generate = function() {
            if (this.length <= 0) {
                return NaN;
            };

            var speciesOfPassword = SPECIES_CHARACTER;
            var exceptCharacters  = this.except;
            for (var i = 0, l = exceptCharacters.length; i < l; i++) {
                var c = exceptCharacters.charAt(i);
                speciesOfPassword = speciesOfPassword.replace(c, '');
            };
            var speciesRange = speciesOfPassword.length;
            if (speciesRange > 0) {
                speciesRange--;
            };

            var password = []
            for (var i = 0, l = this.length; i < l; ++i) {
                var characterIndex    = rand(0, speciesRange);
                var passwordCharacter = speciesOfPassword.charAt(characterIndex);
                password.push(passwordCharacter);
            };

            return password.join('');
        };

        return PasswordGenerator;
    }) ();

    /**
     * mkpasswd - generate new password.
     *
     * <p>mkpasswd generates passwords.</p>
     *
     * Usage:
     *
     * With no arguments, returns a new password of 8 characters.
     * <code>
     * $.mkpasswd();
     * </code>
     *
     * With a length, returns a password for the specified number of characters.
     * <code>
     * $.mkpasswd({length: 24});
     * </code>
     *
     * With a except, returns a password for the  except specified character.
     * <code>
     * $.mkpasswd({except: '0123456789'});
     * </code>
     *
     * @param {Object} The behavior of generator.
     * @return {String} a new password.
     */
    $.mkpasswd = function(options) {
        var setting = $.extend({
            length: 8,
            except: null
        }, options || {});

        var password = (new PasswordGenerator(setting)).generate();

        return password;
    };
}) (this, jQuery);
