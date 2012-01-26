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
function Extendable(obj, parent)
{
    if (this === window) {
        return new Extendable(obj);
    }

    if (obj) {
        this.merge(this, obj);
    }

    // create references all the way back up the tree so
    // child elements can reference their parents, also
    // allow for it to reference the ROOT (top most element)
    if (parent) {
        this.parent = parent;
        this.ROOT = this.parent.ROOT;
    } else {
        this.ROOT = this;
    }

    /**
     * Event map, this._events[eventName] = [
     *      { ttl : n, cb : function() { ... } },
     *      { ttl : n, cb : function() { ... } },
     *      false,
     *      { ttl : n, cb : function() { ... } },
     * ]
     */
    this._eventMap = {};
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
                base[part] = new Extendable({}, base);
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
    },

    /*******************************************************
     * Event emitting Functionality. Every Extendable object
     * can emit events. Inspired by the node.js EventEmitter
     * interface
     *******************************************************/

    _events : function(event) {
        if (!this._eventMap[event]) {
            this._eventMap[event] = [];
        }
        return this._eventMap[event]; 
    },

    /**
     * Registers an event callback
     *
     * @param {String} event name
     * @param {Function} callback
     * @param {Int} tty 0 = always, 1 = once or n times
     */
    on : function(event, callback, tty) {
        var events = this._events(event);

        if (typeof callback != 'function') {
            return; 
        }

        // set a default value
        tty = tty || 0;

        
        events.push({
            tty : tty, 
            cb  : callback
        });
        
        this.emit('newListener', callback); 
    },

    /**
     * Registers an event listerer that only fires once
     *
     * @param {string} event name
     * @param {Function} callback
     */
    once : function(event, callback) {
        this.on(event, callback, 1);
    },

    /**
     * Returns an array of the current listeners attached to 'event'
     *
     * @param {String} event
     * @returns Array
     */
    listeners : function(event) {
        var i, 
            events = this._events(event),
            data = [];

        for (var i in events) {
            if (events[i] !== false) {
                data.push(events[i].cb); 
            }
        }

        return data; 
    },

    /**
     * Emits an event
     *
     * @param {string} Event name
     * @param anything, parameters to be passed to the callback function
     *
     */
    emit : function() {
        var i,
            args = [].slice.call(arguments),
            event = args.shift(), // first element is event name
            events = this._events(event),
            cur;

        for (i=0; i<events.length;i++) {
            if (events[i] === false) {
                continue; 
            }

            cur = events[i];
            if (cur.tty === 1) {
                events[i] = false; // never run again
            } else if (cur.tty > 1) {
                cur.tty = cur.tty - 1;
            }

            cur.cb.apply(this, args);             
        }
    },

    /**
     * Removes all listeners from the event that
     * match callback.
     *
     * @param {String} event
     * @param {Function} callback
     *
     */
    removeListener : function(event, callback) {
        var i,
            events = this._events(event);
        
        for (i=0; i < events.length; i++) {
            if (events[i] == false) {
                continue; 
            }

            if (events[i].cb == callback) {
                events[i] = false;
                continue; 
            }
        }
    }
};