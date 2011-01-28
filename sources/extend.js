/*jslint regexp: true, nomen: true, newcap: true, undef: true, onevar: true, bitwise: true, maxerr: 50, indent: 4 */

/**
 * Copyright (C) 2011 by Benson Wong (mostlygeek@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


var window;

/**
 * Creates a new Extendable object where new functionality
 * can be easily added to it.
 *
 * Usage:
 *
 * var x = new Extendable();
 * x.extend('My.Long.NameSpace', {
 *     foo : function() { return "bar"; }
 * });
 * alert(x.My.Long.NameSpace.foo()); // bar
 * 
 */
function Extendable() {    

    // developer for the "new" operator, but I'm forgiving...
    if (this === window) {        
        return new Extendable();
    }
}

Extendable.prototype = {
    
    constructor : Extendable,

    /**
     * Merge in new members (data / functions) into the
     * target.
     *
     * This will set a pointer to the member in the new object.
     *
     * @param {Object} target
     * @param {Object} source
     * @param {Boolean} overwrite (optional), default false
     */
    merge: function (target, source, overwrite) {
        var key;
        for (key in source) {
            if (!!overwrite || !target[key]) {
                target[key] = source[key];
            }
        }
    },

    /**
     * Creates a new name space level, defined in
     * a dot separated format.
     * 
     * @param {String} namespace ie: Foo.Bar.Woo
     */
    make : function (namespace) {
        var base = this,
            part,
            i,
            parts = namespace ?
                namespace.split('.') : [],
            count = parts.length;

        for (i = 0; i < count; i++) {
            part = parts[i]; // walk down the tree

            // make the level if it doesn't exist
            if (!base[part]) {
                base[part] = {};
            }

            base = base[part]; // next level
        }

        // The final created object
        return base;
    },

    /**
     * The main extension function for extending the object
     * with new functionality
     *
     * @param {Object|String} target to extend functionality on
     * @param {Object} members to extend on
     * @param {Boolean} overwrite if members exists (default false)
     */
    extend: function (target, source, overwrite) {
        // make sure the main object is there.
        if (typeof target === 'string') {
            target = this.make(target);
        }

        // link members in the source object into myself
        this.merge(target, source, !!overwrite);
    }
};