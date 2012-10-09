/**
 * A simple JavaScript class system
 *
 * @author     James Brumond
 * @version    0.1.6
 * @copyright  Copyright 2011 James Brumond
 * @license    Dual licensed under MIT and GPL
 */
(function() {
	var _global = this;
	var namespace = _global;

	// The class constructor
	var createClass = function(name, parent, mixins, constructor) {
		
		// If an array was given for a name, we only want the
		// actual name value
		if (typeof name === 'object' && name) {
			name = name[1] || false;
			if (! name) {
				throw new TypeError('Invalid class name value');
			}
		}

		// Default the parent to the global Object
		if (! parent) {
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
			parent = namespace[parent];
		}
		
		// Inherit from the parent if one was given (inheritence model
		// based roughly on CoffeeScript classes)
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
		
		// Inherit from mixins
		if (mixins) {
			for (var i = 0, c = mixins.length; i < c; i++) {
				if (typeof mixins[i] === 'string') {
					mixins[i] = namespace[mixins[i]];
				}
				mixins[i].mixinTo(self);
			}
		}
		
		// The class/parent name
		self.prototype.__class__ = self.__class__ = name;
		self.prototype.__parent__ = self.__parent__ = parent.__class__ || getNativeClassName(parent);
		self.prototype.__mixins__ = self.__mixins__ = mixins;
		
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
			Class(name, self, constructor);
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
//  Used for the extends() and uses() syntax
	
	var TempClass = function(name) {
		this.parent = null;
		this.mixins = [ ];
		this.uses = function(mixins, constructor) {
			this.mixins.push.apply(this.mixins, mixins);
			if (constructor) {
				return assignTo(name,
					createClass(name, this.parent, this.mixins, constructor)
				);
			}
			return this;
		};
		this.extends = function(parent, constructor) {
			this.parent = parent;
			if (constructor) {
				return assignTo(name,
					createClass(name, this.parent, this.mixins, constructor)
				);
			}
			return this;
		};
	};

// ----------------------------------------------------------------------------
//  Main Functions
	
	function Class(name, parent, constructor) {
		if (arguments.length <= 1) {
			if (name && (typeof name === 'object' || isFunc(name))) {
				return createClass(null, null, [ ], name);
			}
			return new TempClass(name);
		} else if (arguments.length === 2) {
			return assignTo(name,
				createClass(name, null, [ ], parent)
			);
		}
		return assignTo(name,
			createClass(name, parent, [ ], constructor)
		);
	}
	
	Class.mixin = function(name, constructor) {
		if (arguments.length === 1) {
			constructor = name;
			name = null;
		}
		return assignTo(name, new Mixin(constructor));
	};
	
	Class.namespace = function(ns) {
		namespace = ns ? ns : _global;
	};
	
	function Mixin(constructor) {
		this.mixinTo = function(func) {
			for (var i in constructor) {
				if (constructor.hasOwnProperty(i)) {
					func.prototype[i] = constructor[i];
				}
			}
		};
	}

// ----------------------------------------------------------------------------
//  Helper functions
	
	var toString = Object.prototype.toString;
	
	function isFunc(value) {
		return (toString.call(value) === '[object Function]');
	}
	
	function assignTo(name, constructor) {
		if (! name) {
			return constructor;
		} else if (typeof name === 'object' && name.length === 2) {
			name[0][name[1]] = constructor;
		} else if (typeof name === 'string') {
			namespace[name] = constructor;
		} else {
			throw new TypeError('Invalid class/mixin name value');
		}
	}
	
	function getNativeClassName(constructor) {
		return toString.call(new constructor()).slice(8, -1);
	}
	
// ------------------------------------------------------------------
//  Expose
	
	try {
		module.exports.Class = Class;
	} catch (e) {
		_global.Class = Class;
	}
	
}).call();

/* End of file class.js */
