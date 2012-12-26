
Class('Animal', {
	
	construct: function(name) {
		this.name = name;
	},
	
	makeNoise: function(noise) {
		alert(noise);
	}
	
});

Class.mixin('canFoo', {
	
	foo: function() {
		alert('Foo!');
	}
	
});

Class('Person').Extends('Animal').Uses('canFoo', {
	
	speak: function(sayWhat) {
		this.makeNoise(this, this.name + ' says: "' + sayWhat + '"');
	}
	
});

var james = new Person('James');

james.speak('Hello, World');
james.foo();


