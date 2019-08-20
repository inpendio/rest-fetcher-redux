(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('rest-fetcher-base')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'rest-fetcher-base'], factory) :
  (global = global || self, factory(global.reduxrestfetcher = {}, global.lodash, global.restFetcherBase));
}(this, function (exports, lodash, restFetcherBase) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var object = function object() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (lodash.isObject(data)) return data;
    var _data = false;

    if (typeof data === 'string') {
      try {
        _data = JSON.parse(data.trim());
      } catch (e) {
        console.log(e);
      }
    }

    if (_data) return _data;
    return lodash.toPlainObject(data);
  };
  var array = function array() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (lodash.isArray) return data;
    return lodash.toArray(data);
  };
  var cumulativeArray = function cumulativeArray(check) {
    return function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var oldData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (!data) return oldData;
      if (!check) return oldData.concat(lodash.isArray(data) ? data : lodash.toArray(data));

      var newData = _toConsumableArray(oldData);

      data.forEach(function (d) {
        var doesExist = false;
        oldData.forEach(function (o, i) {
          if (d[check] === o[check]) {
            newData[i] = d;
            doesExist = true;
          }
        });
        if (!doesExist) newData.push(d);
      });
      return newData;
    };
  };

  var RFR =
  /*#__PURE__*/
  function (_Base) {
    _inherits(RFR, _Base);

    function RFR() {
      var _this;

      _classCallCheck(this, RFR);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RFR).call(this));

      _this.reducer = function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.genererateInitialState();
        var action = arguments.length > 1 ? arguments[1] : undefined;

        if (action.type.indexOf(_this.basePrefix) === -1 && _this.customActions[action.type]) {
          return _this.resolveCustomAction(state, action);
        }

        if (action.type.indexOf(_this.basePrefix) === -1) return state;
        var name = action.type.substring(_this.basePrefix.length);

        if (name.indexOf('_success') !== -1) {
          name = name.replace('_success', '');
        }

        if (name.indexOf('_fail') !== -1) {
          name = name.replace('_fail', '');
        }

        return _this.reducerPool[name](state, action);
      };

      _this.resolveCustomAction = function (state, action) {
        var newState = Object.assign({}, state);
        Object.keys(_this.customActions[action.type]).forEach(function (key) {
          newState[key] = _this.customActions[action.type][key](state[key], action);
        });
        return newState;
      };

      _this.constructGenericReducer = function (k) {
        return function (state, action) {
          var newState = Object.assign({}, state);
          newState[k] = Object.assign({}, state[k]);
          /* Object.keys(state).forEach(key => {
            newState[key] = Object.assign({}, state[key]);
          }); */

          if (action.loading) {
            if (newState.isLoading && newState.isLoading.length) {
              newState.isLoading.push(k);
            } else {
              newState.isLoading = [];
              newState.isLoading.push(k);
            }
          } else {
            if (newState.isLoading && newState.isLoading.length && newState.isLoading.indexOf(k) !== -1) {
              newState.isLoading.splice(newState.isLoading.indexOf(k), 1);
            }

            if (newState.isLoading && newState.isLoading.length === 0) {
              newState.isLoading = false;
            }
          }

          if (_this.customActions[action.type]) {
            Object.keys(_this.customActions[action.type]).forEach(function (key) {
              newState[key] = _this.customActions[action.type][key](state[key], action);
            });
          }
          /* newState.isLoading = action.loading; */


          if (action.type.indexOf('_success') !== -1) {
            newState[k].loading = false;
            newState[k].data = _this.transformerPool[k](action.payload.data);
            newState[k].ok = action.payload.msg.ok;
            newState[k].redirected = action.payload.msg.redirected;
            newState[k].status = action.payload.msg.status;
            newState[k].type = action.payload.msg.type;
          } else if (action.type.indexOf('_fail') !== -1) {
            newState[k].loading = false;
            newState[k].ok = action.payload.msg.ok;
            newState[k].redirected = action.payload.msg.redirected;
            newState[k].status = action.payload.msg.status;
            newState[k].type = action.payload.msg.type;
            newState[k].error = action.payload.error;
          } else if (_this.customActions[k] && _this.customActions[k][action.type]) {
            return _this.customActions[k][action.type](state, action);
          } else {
            newState[k].loading = true;
            newState[k].request = action.payload.request;
            newState[k].params = action.payload.params;
          }

          return newState;
        };
      };

      _this.genererateInitialState = function () {
        var state = {};
        state.isLoading = false;
        Object.keys(_this.reducerPool).forEach(function (k) {
          state[k] = {
            request: '',
            params: '{}',
            data: _this.transformerPool[k](),
            ok: undefined,
            redirected: undefined,
            status: 0,
            type: ''
          };
        });
        return state;
      };

      _this.actionStart = function (name, request, params) {
        return {
          type: "".concat(_this.basePrefix).concat(name),

          /* name, */
          loading: true,
          payload: {
            request: request,
            params: params
          }
        };
      };

      _this.actionEnd = function (name, data) {
        var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return {
          type: "".concat(_this.basePrefix).concat(name, "_success"),

          /* name, */
          loading: false,
          payload: {
            data: data,
            msg: msg
          }
        };
      };

      _this.actionError = function (name) {
        var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var error = arguments.length > 2 ? arguments[2] : undefined;
        return {
          type: "".concat(_this.basePrefix).concat(name, "_fail"),
          loading: false,
          payload: {
            msg: msg,
            error: error
          }
        };
      };

      _this.addToReducerPool = function (_ref, name) {
        var reducer = _ref.reducer;
        _this.reducerPool[name] = reducer || _this.constructGenericReducer(name);
      };

      _this.addToCustomActionPool = function (_ref2, name) {
        var changeOnAction = _ref2.changeOnAction;

        if (changeOnAction && lodash.isObject(changeOnAction)) {
          Object.keys(changeOnAction).forEach(function (k) {
            if (!_this.customActions[k]) _this.customActions[k] = {};
            _this.customActions[k][name] = changeOnAction[k];
          });
        }
      };

      _this.addToTransformerPool = function (_ref3, name) {
        var _ref3$transformer = _ref3.transformer,
            transformer = _ref3$transformer === void 0 ? object : _ref3$transformer;

        if (transformer && lodash.isFunction(transformer)) {
          _this.transformerPool[name] = transformer;
        }
      };

      _this.getReducer = function () {
        return _this.reducer;
      };

      _this.customActions = {};

      _this.endpointCreationPool.push(_this.addToCustomActionPool);

      _this.endpointCreationPool.push(_this.addToReducerPool);

      _this.endpointCreationPool.push(_this.addToTransformerPool);

      return _this;
    }
    /**
     * @description Reducer you export to your store.
     * This will extract name of the function ( as it containes prefix and sufix).
     * Calls generic reducer set for given name.
     * @param {Object} state - state
     * @param {Object} action - action
     * @memberof Communicator
     */


    return RFR;
  }(restFetcherBase.Base);

  var index = new RFR();

  exports.Api = RFR;
  exports.array = array;
  exports.cumulativeArray = cumulativeArray;
  exports.default = index;
  exports.object = object;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
