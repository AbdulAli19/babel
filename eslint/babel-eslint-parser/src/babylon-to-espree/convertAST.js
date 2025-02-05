import { types as t } from "@babel/core";
import convertProgramNode from "./convertProgramNode";

module.exports = function(ast, traverse, code) {
  const state = { source: code };

  // Monkey patch visitor keys in order to be able to traverse the estree nodes
  t.VISITOR_KEYS.Property = t.VISITOR_KEYS.ObjectProperty;
  t.VISITOR_KEYS.MethodDefinition = [
    "key",
    "value",
    "decorators",
    "returnType",
    "typeParameters",
  ];

  traverse(ast, astTransformVisitor, null, state);

  delete t.VISITOR_KEYS.Property;
  delete t.VISITOR_KEYS.MethodDefinition;

  convertProgramNode(ast);
};

const astTransformVisitor = {
  noScope: true,
  enter(path) {
    const node = path.node;

    // private var to track original node type
    node._babelType = node.type;

    if (node.innerComments) {
      delete node.innerComments;
    }

    if (node.trailingComments) {
      delete node.trailingComments;
    }

    if (node.leadingComments) {
      delete node.leadingComments;
    }
  },
  exit(path) {
    const node = path.node;

    if (path.isTypeParameter()) {
      node.type = "Identifier";
      node.typeAnnotation = node.bound;
      delete node.bound;
    }

    // flow: prevent "no-undef"
    // for "Component" in: "let x: React.Component"
    if (path.isQualifiedTypeIdentifier()) {
      delete node.id;
    }
    // for "b" in: "var a: { b: Foo }"
    if (path.isObjectTypeProperty()) {
      delete node.key;
    }
    // for "indexer" in: "var a: {[indexer: string]: number}"
    if (path.isObjectTypeIndexer()) {
      delete node.id;
    }
    // for "param" in: "var a: { func(param: Foo): Bar };"
    if (path.isFunctionTypeParam()) {
      delete node.name;
    }

    // modules

    if (path.isImportDeclaration()) {
      delete node.isType;
    }

    // template string range fixes
    if (path.isTemplateLiteral()) {
      for (let i = 0; i < node.quasis.length; i++) {
        const q = node.quasis[i];
        q.range[0] -= 1;
        if (q.tail) {
          q.range[1] += 1;
        } else {
          q.range[1] += 2;
        }
        q.loc.start.column -= 1;
        if (q.tail) {
          q.loc.end.column += 1;
        } else {
          q.loc.end.column += 2;
        }
      }
    }
  },
};
