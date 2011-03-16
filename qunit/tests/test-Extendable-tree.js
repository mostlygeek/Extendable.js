/**
 * Test that the ROOT and the parent functionality
 * works correctly
 */

module('Extendable.js, Tree Tests');
test('test namespace tree references', function() {

    var a = new Extendable({
        me : 'a'
    });

    a.extend('b', {
        me : 'b'
    });

    a.b.extend('c', {
        me : 'c'
    });

    expect(8);

    equals('a', a.me);

    equals('b', a.b.me);

    equals('c', a.b.c.me);
    
    equals('b', a.b.c.parent.me);           // c.parent = b
    equals('a', a.b.c.parent.parent.me);    // c.parent.parent = a

    equals('a', a.b.c.ROOT.me);             // ROOT = a
    equals('b', a.b.c.ROOT.b.me);
    equals('c', a.b.c.ROOT.b.c.me);

});

test('Regression, parent reference not created correctly', function() {

    var a = new Extendable({
        me : 'a'
    });

    a.extend('b.c.d', {
        me : 'd'
    });

    // use true here as qunit seems to barf on
    // recursive check (if the bug exists)
    equal(true, a.b.c == a.b.c.d.parent, "parent not set correctly");
    equal(true, a == a.b.c.d.ROOT, "ROOT not set correctly");
});