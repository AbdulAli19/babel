"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys.js");

var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each.js");

var _context;

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault.js");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property.js");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var _exportNames = {
  exp: true
};
exports.exp = void 0;

var _bar = _interopRequireDefault(require("bar"));

var _fuz = require("fuz");

var _mod = require("mod");

_forEachInstanceProperty(_context = _Object$keys(_mod)).call(_context, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mod[key];
    }
  });
});

const exp = _bar.default + _fuz.baz;
exports.exp = exp;
