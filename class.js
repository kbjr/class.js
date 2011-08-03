/**
 * A simple JavaScript class system
 *
 * @author     James Brumond
 * @version    0.1.5
 * @copyright  Copyright 2011 James Brumond
 * @license    Dual licensed under MIT and GPL
 */
(function() {
	var _global = this;

	// The class constructor
	var createClass = function(name, parent, constructor) {
		
		// If an array was given for a name, we only want the
		// actual name value
		if (typeof name === 'object') {
			name = name[1] || false;
			if (! name) {
				throw new TypeError('Invalid class name value');
			}
		}

		// If only one parameter is given, it is a constructor,
		// not a parent class
		if (constructor === void(0)) {
			constructor = parent;
			parent = Object;
		}

		// The actual constructor function
		var self = function() {
			var inst = this;
			if (! inst instanceof self) {
				throw new Error('Classes should be called with the new keyword.');
			}
			// If a function was given as the constructor, it should
			// be called every time a new instance is created
			if (typeof constructor === 'function') {
				constructor.apply(inst, arguments);
			}
			// If a construct() method exists, it should also be called
			if (typeof inst.construct === 'function') {
				inst.construct.apply(inst, arguments);
			}
		};
		
		// Fetch the parent if a string is given
		if (typeof parent === 'string') {
			parent = _global[parent];
		}
		
		// Inherit from the parent if one was given (inheritence model
		// based on CoffeeScript classes)
		var _super = parent.prototype;
		for (var i in parent) {
			if (parent.hasOwnProperty(i)) {
				self[i] = parent[i];
			}
		}
		var ctor = function() {
			this.constructor = self;
		};
		ctor.prototype = parent.prototype;
		self.prototype = new ctor();
		
		// The class/parent name
		self.prototype.__class__ = self.__class__ = name;
		self.prototype.__parent__ = self.__parent__ = parent.__class__ || getNativeClassName(parent);
		
		// Expose the parent
		self.prototype.parent = self.parent = _super;
		
		// For super/parent scoping
		self.prototype.__scope__ = self;

		// If an object was given as the constructor, the properties
		// should be placed on the prototype
		if (typeof constructor === 'object') {
			for (var i in constructor) {
				self.prototype[i] = constructor[i];
				// Build a parent method on all class methods that will allow
				// calling supers with this.method.parent(this, ...)
				if (isFunc(self.prototype[i])) {
					(function(method) {
						self.prototype[method].parent = function(that) {
							var scope = that.__scope__;
							var args = Array.prototype.slice.call(arguments, 1);
							that.__scope__ = that.__scope__.parent;
							var result = scope.parent[method].apply(that, args);
							that.__scope__ = scope;
							return result;
						};
						self.prototype[method].parentApply = function(that, args) {
							args = Array.prototype.slice.call(args, 0);
							args.unshift(that);
							self.prototype[method].parent.apply(that, args);
						};
					}(i));
				}
			}
		}

	// ----------------------------------------------------------------------------
	//  Create the external functions
		
		/**
		 * Extend the current class
		 *
		 * @access  public
		 * @param   string    the class name
		 * @param   function  the constructor function
		 * @return  void
		 */
		self.extend = function(name, constructor) {
			_global.Class(name, self, constructor);
		};

		/**
		 * Create a new instance of the class
		 *
		 * @access  public
		 * @return  object
		 */
		self.create = function() {
			return new self();
		};
		
		/**
		 * A toString method that identifies this as a class
		 */
		self.toString = function() {
			return '[object Class]';
		};
		
		return self;
	};

// ----------------------------------------------------------------------------
//  Used for the Class(...).extends(...) syntax
	
	var TempClass = function(name) {
		this.extends = function(parent, constructor) {
			return assignClass(name, createClass(name, parent, constructor));
		};
	};

// ----------------------------------------------------------------------------
//  Expose
	
	_global.Class = function(name, parent, constructor) {
		if (arguments.length === 1) {
			return new TempClass(name);
		} else {
			return assignClass(name, createClass(name, parent, constructor));
		}
	};

// ----------------------------------------------------------------------------
//  Helper functions
	
	var toString = Object.prototype.toString;
	
	function isFunc(value) {
		return (toString.call(value) === '[object Function]');
	};
	
	function assignClass(name, constructor) {
		if (name === 0) {
			return constructor;
		} else if (typeof name === 'object' && name.length === 2) {
			name[0][name[1]] = constructor;
		} else if (typeof name === 'string') {
			_global[name] = constructor;
		} else {
			throw new TypeError('Invalid class name value');
		}
	};
	
	function getNativeClassName(constructor) {
		var str = toString.call(new constructor()).split(' ')[1];
		return str.substr(0, str.length - 1);
	};
	
}).call();

/* End of file class.js */
