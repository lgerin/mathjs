// test BlockNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    AssignmentNode = require('../../../lib/expression/node/AssignmentNode'),
    BlockNode = require('../../../lib/expression/node/BlockNode');

describe('BlockNode', function() {

  it ('should create a BlockNode', function () {
    var n = new BlockNode();
    assert(n instanceof BlockNode);
    assert(n instanceof Node);
  });

  it ('should compile and evaluate a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode('number', '5'), true);
    n.add(new AssignmentNode('foo', new ConstantNode('number', '3')), false);
    n.add(new SymbolNode('foo'), true);

    var scope = {};
    assert.deepEqual(n.compile(math).eval(scope), [5, 3]);
    assert.deepEqual(scope, {foo: 3});
  });

  it ('expressions should be visible by default', function () {
    var n = new BlockNode();
    n.add(new ConstantNode('number', '5'));

    assert.deepEqual(n.compile(math).eval(), [5]);
  });

  it ('should find a BlockNode', function () {
    var a = new ConstantNode('number', '5');
    var b2 = new ConstantNode('number', '3');
    var b = new AssignmentNode('foo', b2);
    var c = new SymbolNode('foo');
    var d = new BlockNode();
    d.add(a, true);
    d.add(b, false);
    d.add(c, true);

    assert.deepEqual(d.find({type: BlockNode}),     [d]);
    assert.deepEqual(d.find({type: SymbolNode}),    [c]);
    assert.deepEqual(d.find({type: RangeNode}),     []);
    assert.deepEqual(d.find({type: ConstantNode}),  [a, b2]);
    assert.deepEqual(d.find({type: ConstantNode, properties: {value: '3'}}),  [b2]);
  });

  it ('should match a BlockNode', function () {
    var a = new BlockNode();
    assert.equal(a.match({type: BlockNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode('number', '5'), true);
    n.add(new AssignmentNode('foo', new ConstantNode('number', '3')), false);
    n.add(new SymbolNode('foo'), true);

    assert.equal(n.toString(), '5\nfoo = 3;\nfoo');
  });

});
