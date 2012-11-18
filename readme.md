# class.js

Simple but powerful classical inheritence for JavaScript.

## Node.js install

```bash
$ npm install classes
```

If using Node.js, you may want to make classes global using code such as this near the beginning of your application.

```javascript
global.Class = require('classes').Class;
```

## Basic Example

```javascript
// If using Node.js, the module needs to be required (unless global as shown above)
var Class = require('classes').Class;

// A general animal class
Class('Animal', {
    
    construct: function(name) {
        this.name = name;
    },
    
    makeNoise: function(noise) {
        alert(noise);
    }
    
});

// Create a class for making people
Class('Person').Extends('Animal', {
    
    speak: function(sayWhat) {
        this.makeNoise(this.name + ' says: "' + sayWhat + '"');
    }
    
});

// Create an instance of our person class
var james = new Person('James');

// And make them talk
james.speak('Hello, World');
```

## Extending Classes

There are multiple allowed syntaxes for extending classes, which you can choose at your preference.

```javascript
// Create a base class first
Class('A', {
    ...
});

// Using the Extends() syntax
Class('B').Extends(A, {
    ...
});

// Using the complex Class() syntax
Class('B', A, {
    ...
});

// Using the extend() syntax
A.extend('B', {
    ...
});
```

Also note, that when using the `Extends()` syntax or the complex `Class()` syntax, both a parent class _variable_ (`A`) or _string_ (`'A'`) is allowed, but if you use the string syntax, the parent class must exist on the namespace object.

## Using Super

You can call the super of any method at any time. This is done using the `parent` method on your class methods.

```javascript
Class('A').Extends(SomeOtherClass, {
    
    method: function() {
        // Call the method's super
        this.method.parent(this);
    },
    
    methodWithArgs: function(arg1) {
        // Call this method's super, passing the argument along
        this.methodWithArgs.parent(this, arg1);
    },

    anotherMethod: function() {
        // Call the super, but pass in the arguments object
        this.anotherMethod.parentApply(this, arguments);
    },
    
});
```

## Creating Anonymous Classes

Using class.js, classes don't have to be assigned a name. You can also tell the `Class()` function to simply return the constructed class function by passing a falsey first param (like `Class(null)`) or by simply not giving one as seen below.

```javascript
// This class will automatically be declared at global.Animal
Class('Animal', {
    ...
});

// This class will not be declared globally, but instead just returned
var Snake = Class().Extends(Animal, {
    ...
});

// A slightly cleaner syntax
var Snake = Animal.extend({
    // ...
});
```

## Defining Classes in Non-Global Scope

To define a class, but assign it somewhere other that the global object, you pass in a two key array as the class name. The first value is the object to define the class on, and the second is the class name.

```javascript
// This is where we will put the class
var someObject = { };

// Now define the class
Class([someObject, 'Animal'], {
    ...
});

// And use the class
var animal = new someObject.Animal();
```

This is equivilent to the following:

```javascript
someObject.Animal = Class({
	...
});
```

## Using Mixins

As of version 0.2.0, mixins are supported. It should be noted that mixins are __not__ the same as sub-class inheritence. A single class can implement both a parent class as well as mixins. Mixins are defined using the `Class.mixin` method.

```javascript
Class.mixin('CanFoo', {
	
	foo: function() {
		alert('Foo!');
	}
	
});
```

Once created, a mixin is used with the `uses` method when defining a class.

```javascript
Class('Thing').Uses([ 'CanFoo' ], {
	
	// ...
	
});

var thing = new Thing();
thing.foo();
```

Mixins are different from inheritence in the sense that they do no add to the inheritence chain, they simply extend the current class with certain functionality. You cannot use `instanceof` to determine mixin inheritence because classes are not instances of mixins; In fact, there is no such thing as an _instance_ of a mixin, they are just objects.

## Using Namespaces

Before version 0.2.0, all new classes and mixins were defined, by default, on the global object, and if you wanted to define one elsewhere, you would have to use either anonymous classes or the array syntax (eg. `Class([exports, 'Foo'], ...)`). There is now a new way of defining namespaced classes that should prove useful, especially in the case of Node.js.

```javascript
var Class = require('classes').Class;
Class.namespace(exports);

Class('Foo', {
	
	// ...
	
});

var foo = new exports.Foo();
```

The `Class.namespace()` function sets the default namespace, allowing shorter, more readable class declarations. Simply call `Class.namespace(exports)` at the top of your modules and your classes will automatically be defined in the correct space.






















