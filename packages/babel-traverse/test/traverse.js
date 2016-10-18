let traverse = require("../lib").default;
let assert   = require("assert");
let _        = require("lodash");

describe("traverse", function () {
  let ast = {
    type: "Program",
    body: [
      {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "foo",
            },
            "init": {
              "type": "StringLiteral",
              "value": "bar",
              "raw": "\'bar\'"
            }
          }
        ],
        "kind": "var"
      },
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "ThisExpression"
            },
            "property": {
              "type": "Identifier",
              "name": "test"
            }
          },
          "right": {
            "type": "StringLiteral",
            "value": "wow",
            "raw": "\'wow\'"
          }
        }
      }
    ]
  };

  let body = ast.body;

  it("traverse replace", function () {
    let replacement = {
      type: "StringLiteral",
      value: "foo"
    };
    let ast2 = _.cloneDeep(ast);

    traverse(ast2, {
      enter: function (path) {
        if (path.node.type === "ThisExpression") path.replaceWith(replacement);
      }
    });

    assert.equal(ast2.body[1].expression.left.object, replacement);
  });

  it("traverse", function () {
    let expect = [
      body[0], body[0].declarations[0], body[0].declarations[0].id, body[0].declarations[0].init,
      body[1], body[1].expression, body[1].expression.left, body[1].expression.left.object, body[1].expression.left.property, body[1].expression.right
    ];

    let actual = [];

    traverse(ast, {
      enter: function (path) {
        actual.push(path.node);
      }
    });

    assert.deepEqual(actual, expect);
  });

  it("traverse falsy parent", function () {
    traverse(null, {
      enter: function () {
        throw new Error("should not be ran");
      }
    });
  });

  it("traverse blacklistTypes", function () {
    let expect = [
      body[0], body[0].declarations[0], body[0].declarations[0].id, body[0].declarations[0].init,
      body[1], body[1].expression, body[1].expression.right
    ];

    let actual = [];

    traverse(ast, {
      blacklist: ["MemberExpression"],
      enter: function (path) {
        actual.push(path.node);
      }
    });

    assert.deepEqual(actual, expect);
  });

  it("hasType", function () {
    assert.ok(traverse.hasType(ast, null, "ThisExpression"));
    assert.ok(!traverse.hasType(ast, null, "ThisExpression", ["AssignmentExpression"]));

    assert.ok(traverse.hasType(ast, null, "ThisExpression"));
    assert.ok(traverse.hasType(ast, null, "Program"));

    assert.ok(!traverse.hasType(ast, null, "ThisExpression", ["MemberExpression"]));
    assert.ok(!traverse.hasType(ast, null, "ThisExpression", ["Program"]));

    assert.ok(!traverse.hasType(ast, null, "ArrowFunctionExpression"));
  });

  it("clearCache", function () {
    let paths = [];
    traverse(ast, {
      enter: function (path) {
        paths.push(path);
      }
    });

    traverse.clearCache();

    let paths2 = [];
    traverse(ast, {
      enter: function (path) {
        paths2.push(path);
      }
    });

    paths2.forEach(function (p, i) {
      assert.notStrictEqual(p, paths[i]);
    });
  });
});
