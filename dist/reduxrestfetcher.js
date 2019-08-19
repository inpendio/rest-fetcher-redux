!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("lodash"),require("rest-fetcher-base")):"function"==typeof define&&define.amd?define(["exports","lodash","rest-fetcher-base"],e):e((t=t||self).reduxrestfetcher={},t.lodash,t.restFetcherBase)}(this,function(t,i,e){function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function _toConsumableArray(t){return function _arrayWithoutHoles(t){if(Array.isArray(t)){for(var e=0,o=new Array(t.length);e<t.length;e++)o[e]=t[e];return o}}(t)||function _iterableToArray(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function f(t){var e=0<arguments.length&&void 0!==t?t:{};if(i.isObject(e))return e;var o=!1;if("string"==typeof e)try{o=JSON.parse(e.trim())}catch(t){console.log(t)}return o||i.toPlainObject(e)}var o=function(){function RFR(){var n;return function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,RFR),(n=_possibleConstructorReturn(this,_getPrototypeOf(RFR).call(this))).reducer=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:n.genererateInitialState(),e=1<arguments.length?arguments[1]:void 0;if(-1===e.type.indexOf(n.basePrefix))return t;var o=e.type.substring(n.basePrefix.length);return-1!==o.indexOf("_success")&&(o=o.replace("_success","")),-1!==o.indexOf("_fail")&&(o=o.replace("_fail","")),n.reducerPool[o](t,e)},n.constructGenericReducer=function(t){return function(e,o){var r=Object.assign({},e);if(r[t]=Object.assign({},e[t]),o.loading?(r.isLoading&&r.isLoading.length||(r.isLoading=[]),r.isLoading.push(t)):(r.isLoading&&r.isLoading.length&&-1!==r.isLoading.indexOf(t)&&r.isLoading.splice(r.isLoading.indexOf(t),1),r.isLoading&&0===r.isLoading.length&&(r.isLoading=!1)),n.customActions[o.type]&&Object.keys(n.customActions[o.type]).forEach(function(t){r[t]=n.customActions[o.type][t](e[t],o)}),-1!==o.type.indexOf("_success"))r[t].loading=!1,r[t].data=n.transformerPool[t](o.payload.data),r[t].ok=o.payload.msg.ok,r[t].redirected=o.payload.msg.redirected,r[t].status=o.payload.msg.status,r[t].type=o.payload.msg.type;else if(-1!==o.type.indexOf("_fail"))r[t].loading=!1,r[t].ok=o.payload.msg.ok,r[t].redirected=o.payload.msg.redirected,r[t].status=o.payload.msg.status,r[t].type=o.payload.msg.type,r[t].error=o.payload.error;else{if(n.customActions[t]&&n.customActions[t][o.type])return n.customActions[t][o.type](e,o);r[t].loading=!0,r[t].request=o.payload.request,r[t].params=o.payload.params}return r}},n.genererateInitialState=function(){var e={isLoading:!1};return Object.keys(n.reducerPool).forEach(function(t){e[t]={request:"",params:"{}",data:n.transformerPool[t](),ok:void 0,redirected:void 0,status:0,type:""}}),e},n.actionStart=function(t,e,o){return{type:"".concat(n.basePrefix).concat(t),loading:!0,payload:{request:e,params:o}}},n.actionEnd=function(t,e){var o=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};return{type:"".concat(n.basePrefix).concat(t,"_success"),loading:!1,payload:{data:e,msg:o}}},n.actionError=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},o=2<arguments.length?arguments[2]:void 0;return{type:"".concat(n.basePrefix).concat(t,"_fail"),loading:!1,payload:{msg:e,error:o}}},n.addToReducerPool=function(t,e){var o=t.reducer;n.reducerPool[e]=o||n.constructGenericReducer(e)},n.addToCustomActionPool=function(t,e){var o=t.changeOnAction;o&&i.isObject(o)&&Object.keys(o).forEach(function(t){n.customActions[t]||(n.customActions[t]={}),n.customActions[t][e]=o[t]})},n.addToTransformerPool=function(t,e){var o=t.transformer,r=void 0===o?f:o;r&&i.isFunction(r)&&(n.transformerPool[e]=r)},n.getReducer=function(){return n.reducer},n.customActions={},n.endpointCreationPool.push(n.addToCustomActionPool),n.endpointCreationPool.push(n.addToReducerPool),n.endpointCreationPool.push(n.addToTransformerPool),n}return function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(RFR,e.Base),RFR}(),r=new o;t.Api=o,t.array=function array(t){var e=0<arguments.length&&void 0!==t?t:[];return i.isArray?e:i.toArray(e)},t.cumulativeArray=function cumulativeArray(a){return function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];if(!t)return e;if(!a)return e.concat(i.isArray(t)?t:i.toArray(t));var n=_toConsumableArray(e);return t.forEach(function(o){var r=!1;e.forEach(function(t,e){o[a]===t[a]&&(n[e]=o,r=!0)}),r||n.push(o)}),n}},t.default=r,t.object=f,Object.defineProperty(t,"__esModule",{value:!0})});