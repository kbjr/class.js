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
		console.log('Foo!');
	}
});

Class('Person').extends('Animal').uses('canFoo', {
	
	speak: function(sayWhat) {
		this.makeNoise(this, this.name + ' says: "' + sayWhat + '"');
	}
	
});

var james = new Person('James');
james.makeNoise('Hello, World');

Class('Thing').extends('Person').uses([ 'canFoo' ], {
	
});











