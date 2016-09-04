/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ServerSendEventHandler = __webpack_require__(1);
	
	var _ServerSendEventHandler2 = _interopRequireDefault(_ServerSendEventHandler);
	
	var _ProductList = __webpack_require__(3);
	
	var _ProductList2 = _interopRequireDefault(_ProductList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by simon on 9/4/16.
	 */
	window.onload = function () {
	    var product_list = new _ProductList2.default();
	    var sse_handler = new _ServerSendEventHandler2.default();
	    product_list.loadList('./getProductList.php');
	    makeTableFromProductList("product_list", product_list.getProductList());
	};
	function makeTableFromProductList(tbody_id, product_list) {
	    var tbody = document.getElementById(tbody_id);
	    var docfrag = document.createDocumentFragment();
	    Array.prototype.forEach.call(product_list, function (product) {
	        var tr = document.createElement("tr");
	        var name = product.name;
	        var price = product.price;
	        var stock = product.stock;
	
	        var td_name = document.createElement('td');
	        var td_price = document.createElement('td');
	        var td_stock = document.createElement('td');
	        td_name.textContent = product.name;
	        td_price.textContent = product.price;
	        td_stock.textContent = product.stock;
	        tr.appendChild(td_name);
	        tr.appendChild(td_price);
	        tr.appendChild(td_stock);
	        docfrag.appendChild(tr);
	    });
	    tbody.appendChild(docfrag);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by simon on 9/4/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	var _ServerSendEventHandlerException = __webpack_require__(2);
	
	var _ServerSendEventHandlerException2 = _interopRequireDefault(_ServerSendEventHandlerException);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ADD = 0; // 產品新增事件代碼
	var UPDATE = 1; // 產品修改事件代碼
	var DELETE = 2; // 產品刪除事件代碼
	/**
	 * Server Send Event 處理物件
	 */
	
	var ServerSendEventHandler = function () {
	    function ServerSendEventHandler() {
	        _classCallCheck(this, ServerSendEventHandler);
	
	        this.update_events = [];
	        this.delete_events = [];
	        this.add_events = [];
	    }
	
	    /**
	     * 取得產品新增事件代碼
	     * @returns {number}
	     * @constructor
	     */
	
	
	    _createClass(ServerSendEventHandler, [{
	        key: 'listen',
	
	
	        /**
	         * 開始監聽 Server Send Event 並進行處理
	         * @param url
	         */
	        value: function listen(url) {
	            if ([this.update_events.length, this.delete_events.length, this.add_events.length].includes(0)) {
	                throw new _ServerSendEventHandlerException2.default('Error #2: Event handlers must be specified before listing event.');
	            }
	            var evtSource = new EventSource("url");
	            evtSource.addEventListener('add', function (e) {
	                var response_data = JSON.parse(e.data);
	                Array.prototype.forEach.call(this.add_events, function (event_handler) {
	                    event_handler(response_data);
	                });
	            }, false);
	            evtSource.addEventListener('update', function (e) {
	                var response_data = JSON.parse(e.data);
	                Array.prototype.forEach.call(this.update_events, function (event_handler) {
	                    event_handler(response_data);
	                });
	            }, false);
	            evtSource.addEventListener('delete', function (e) {
	                var response_data = JSON.parse(e.data);
	                Array.prototype.forEach.call(this.delete_events, function (event_handler) {
	                    event_handler(response_data);
	                });
	            }, false);
	            evtSource.onerror = function (e) {
	                throw new _ServerSendEventHandlerException2.default('Error #4: Server send event failed: ' + e.message + '.');
	            };
	        }
	
	        /**
	         * 附加事件處理函數
	         * @param event_type
	         * @param event_handler
	         */
	
	    }, {
	        key: 'addEventHandler',
	        value: function addEventHandler(event_type, event_handler) {
	            switch (event_type) {
	                case Notifier.ADD:
	                    this.add_events.push(event_handler);
	                    break;
	                case Notifier.UPDATE:
	                    this.update_events.push(event_handler);
	                    break;
	                case Notifier.DELETE:
	                    this.delete_events.push(event_handler);
	                    break;
	                default:
	                    throw new _ServerSendEventHandlerException2.default('Error #1: Invalid event types: ' + event_type + '.');
	                    break;
	            }
	        }
	
	        /**
	         * 移除事件處理函數
	         * @param event_type
	         * @param event_handler
	         */
	
	    }, {
	        key: 'removeEventHandler',
	        value: function removeEventHandler(event_type, event_handler) {
	            switch (event_type) {
	                case Notifier.ADD:
	                    var index = this.add_events.findIndex(function (item) {
	                        return Object.is(item, event_handler);
	                    });
	                    if (index === -1) {
	                        throw new _ServerSendEventHandlerException2.default('Error #3: No such event handler.');
	                    }
	                    this.add_events.splice(index, 1);
	                    break;
	                case Notifier.UPDATE:
	                    this.update_events.findIndex(function (item) {
	                        return Object.is(item, event_handler);
	                    });
	                    if (index === -1) {
	                        throw new _ServerSendEventHandlerException2.default('Error #3: No such event handler.');
	                    }
	                    this.update_events.splice(index, 1);
	                    break;
	                case Notifier.DELETE:
	                    this.delete_events.findIndex(function (item) {
	                        return Object.is(item, event_handler);
	                    });
	                    if (index === -1) {
	                        throw new _ServerSendEventHandlerException2.default('Error #3: No such event handler.');
	                    }
	                    this.delete_events.splice(index, 1);
	                    break;
	                default:
	                    throw new _ServerSendEventHandlerException2.default('Error #1: Invalid event types: ' + event_type + '.');
	                    break;
	            }
	        }
	    }], [{
	        key: 'ADD',
	        get: function get() {
	            return ADD;
	        }
	
	        /**
	         * 取得產品修改事件代碼
	         * @returns {number}
	         * @constructor
	         */
	
	    }, {
	        key: 'UPDATE',
	        get: function get() {
	            return UPDATE;
	        }
	
	        /**
	         * 取得產品刪除事件代碼
	         * @returns {number}
	         * @constructor
	         */
	
	    }, {
	        key: 'DELETE',
	        get: function get() {
	            return DELETE;
	        }
	    }]);
	
	    return ServerSendEventHandler;
	}();
	
	exports.default = ServerSendEventHandler;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Created by simon on 9/4/16.
	 */
	
	/**
	 * ServerSendEventHandler 專屬 Exception
	 */
	var ServerSendEventHandlerException = function (_Error) {
	  _inherits(ServerSendEventHandlerException, _Error);
	
	  function ServerSendEventHandlerException(message) {
	    _classCallCheck(this, ServerSendEventHandlerException);
	
	    var _this = _possibleConstructorReturn(this, (ServerSendEventHandlerException.__proto__ || Object.getPrototypeOf(ServerSendEventHandlerException)).call(this, message));
	
	    _this.name = _this.constructor.name;
	    _this.message = message;
	    return _this;
	  }
	
	  return ServerSendEventHandlerException;
	}(Error);
	
	exports.default = ServerSendEventHandlerException;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by simon on 9/4/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _ProductListException = __webpack_require__(4);
	
	var _ProductListException2 = _interopRequireDefault(_ProductListException);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 維護本地產品列表的物件
	 */
	var ProductList = function () {
	    function ProductList() {
	        _classCallCheck(this, ProductList);
	
	        this.product_list = [];
	    }
	
	    /**
	     * 從 Server 取得目前所有產品列表
	     * @param url Server Url
	     */
	
	
	    _createClass(ProductList, [{
	        key: "loadList",
	        value: function loadList(url) {
	            try {
	                var xhr = new XMLHttpRequest();
	                // 因為這個方法必須確實取得資料才能回傳，所以使用同步版本的 xhr
	                xhr.open("GET", url, false);
	                xhr.send();
	                var result = JSON.parse(xhr.responseText);
	                this.product_list = result;
	                return result;
	            } catch (e) {
	                throw new _ProductListException2.default("Error #1: Cannot load product list from remote server: " + url + ".");
	            }
	        }
	
	        /**
	         * 取得產品列表
	         * @returns {Array|*}
	         */
	
	    }, {
	        key: "getProductList",
	        value: function getProductList() {
	            return this.product_list;
	        }
	
	        /**
	         * 增加產品
	         */
	
	    }, {
	        key: "addItem",
	        value: function addItem(item) {
	            this.product_list.push(item);
	        }
	
	        /**
	         * 刪除產品
	         * @param id
	         */
	
	    }, {
	        key: "deleteItemById",
	        value: function deleteItemById(id) {
	            var index = this.product_list.findIndex(function (item) {
	                return id === item.id;
	            });
	            if (index === -1) {
	                throw new _ProductListException2.default("Error #2: Delete product error, not such product id: " + id + ".");
	            }
	            this.product_list.splice(index, 1);
	        }
	
	        /**
	         * 更新產品
	         * @param updating_item
	         */
	
	    }, {
	        key: "updateItem",
	        value: function updateItem(updating_item) {
	            var index = this.product_list.findIndex(function (item) {
	                return item.id === updating_item.id;
	            });
	            if (index === -1) {
	                throw new _ProductListException2.default("Error #3: Update product error, not such product id: " + id + ".");
	            }
	            // 更新產品部分資訊
	            for (var prop in updating_item) {
	                if (Object.prototype.hasOwnProperty.call(updating_item, prop)) {
	                    this.product_list[index][prop] = updating_item[prop];
	                }
	            }
	        }
	    }]);
	
	    return ProductList;
	}();
	
	exports.default = ProductList;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Created by simon on 9/4/16.
	 */
	
	/**
	 * ProductList 專屬 Exception
	 */
	var ProductListException = function (_Error) {
	  _inherits(ProductListException, _Error);
	
	  function ProductListException(message) {
	    _classCallCheck(this, ProductListException);
	
	    var _this = _possibleConstructorReturn(this, (ProductListException.__proto__ || Object.getPrototypeOf(ProductListException)).call(this, message));
	
	    _this.name = _this.constructor.name;
	    _this.message = message;
	    return _this;
	  }
	
	  return ProductListException;
	}(Error);
	
	exports.default = ProductListException;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map