/**
 *
 * Test that the event emitter functionality is
 * working correctly
 */

module('Extendable.js, Event Emitter Tests');
test('Test on()', function() {

    var em = new Extendable(),
        c = 0;

    equals(0, c);
    em.on('test', function() {
        c = c + 1; // use a closure to test
    });

    em.emit('test');
    em.emit('test'); 
    em.emit('test');

    equals(3, c);
});

test('Test once()', function() {

    var em = new Extendable(),
        c = 0;

    equals(0, c);
    em.once('test', function() {
        c = c + 1; // use a closure to test
    });

    em.emit('test');
    em.emit('test');

    equals(1, c);
});

test('Test emit() passes arguments correctly', function() {

    var em = new Extendable();

    em.on('test', function(arg1, arg2) {
        equals(1, arg1);
        equals('two', arg2);
    });

    em.emit('test', 1, 'two');
});

test('Test listeners() and removeListeners()', function() {

    var em = new Extendable(),
        c = 0, d = 0,
        callback1 = function() { c = c + 1; },
        callback2 = function() { d = d + 1; };

    equals(0, em.listeners('test').length);
    
    em.on('test', callback1);
    em.on('test', callback1);
    em.on('test', callback1);

    em.on('test', callback2);
    em.on('test', callback2);
    em.on('test', callback2);

    equals(6, em.listeners('test').length);

    equals(0, c);
    equals(0, d);

    em.emit('test');

    // makes sure they fired
    equals(3, c);
    equals(3, d);

    em.removeListener('test', callback1);

    equals(3, em.listeners('test').length);

    em.removeListener('test', callback2);
    equals(0, em.listeners('test').length);
});

test('extended items also have event emitters', function() {

    var a = new Extendable();

    a.extend('b.c.d.e', {});

    equals('function', typeof a.b.c.d.e.on, "missing on() method");
});