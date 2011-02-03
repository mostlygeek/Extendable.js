module('Extendable.js, core Tests');

/**
 * Test object returns correctly when new is not used
 */
test('missing new keyword still returns Extendable', function() {

   var ns = Extendable(),
       ns2 = new Extendable();

   ok(ns instanceof Extendable,  "not instanceof Extendable");
   ok(ns2 instanceof Extendable, "not instanceof Extendable");
});

test('merge() works correctly', function() {
   var obj1 = {"hello" : "world"},
       obj2 = { "foo" : "bar"};

   Extendable.prototype.merge(obj1, obj2);
   ok(obj1.foo === obj2.foo, "merge failed"); 
});

test('make() creates namespace correctly', function() {

    var a = new Extendable();
    a.make('b.c.d');

    ok(a instanceof Extendable, "a is not an Extendable");
    ok(a.b instanceof Extendable, "a.b is not an Extendable");
    ok(a.b.c instanceof Extendable, "a.b.c is not an Extendable");
    ok(a.b.c.d instanceof Extendable, "a.b.c.d is not an Extendable");
});

test('extend() works correctly', function() {

    var a = new Extendable();

    a.extend('b.c', {
        'foo' : function() { return 'bar' }
    });

    ok(a instanceof Extendable, "a is not an Extendable");
    ok(a.b instanceof Extendable, "a.b is not an Extendable");
    ok(a.b.c instanceof Extendable, "a.b.c is not an Extendable");

    equals('bar', a.b.c.foo(), "extend function failed");
});

test('test extend() works correctly on sub-sections', function() {

    var a = new Extendable();
    a.extend('b', {});

    ok(a.b instanceof Extendable, "a.b.c.d is not an Extendable");

    a.b.extend('c.d', {
        foo : function() { return 'bar' }
    });

    ok(a.b.c.d instanceof Extendable, "a.b.c.d was not added on correctly");
    equals('bar', a.b.c.d.foo());
});