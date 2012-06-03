# class.js

## Basic Example

```javascript
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
Class('Person').extends('Animal', {
    
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

// Using the extends() syntax
Class('B').extends(A, {
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

Also note, that when using the extends() syntax or the complex Class() syntax, both a parent class *variable* (`A`) or *string* (`'A'`) is allowed, but if you use the string syntax, the parent class must exist on the global object.

## Using Super

You can call the super of any method at any time. This is done using the `parent` method on your class methods.

```javascript
Class('A').extends(SomeOtherClass, {
    
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

Using class.js, classes don't have to be assigned a name. You can also tell the Class() function to simply return the constructed class function by passing a name value (the first parameter of @Class@) of 0.

```javascript
// This class will automatically be declared at global.Animal
Class('Animal', {
    ...
});

// This class will not be declared globally, but instead just returned
var Snake = Class().extends(Animal, {
    ...
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

As of version 0.2.0, mixins are supported. It should be noted that mixins are *not* the same as sub-class inheritence. A single class can implement both a parent class as well as mixins. Mixins are defined using the `Class.mixin' method.

```javascript
var canFoo = Class.mixin({
	
	foo: function() {
		alert('Foo!');
	}
	
});
```

Once created, a mixin is used with the `uses` method when defining a class.

```javascript
Class('Thing').uses([ canFoo ], {
	
	// ...
	
});

var thing = new Thing();
thing.foo();
```

