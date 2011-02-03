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
    
    equals('b', a.b.c.parent.me);
    equals('a', a.b.c.parent.parent.me);

    equals('a', a.b.c.ROOT.me);
    equals('b', a.b.c.ROOT.b.me);
    equals('c', a.b.c.ROOT.b.c.me);

});