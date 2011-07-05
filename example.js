Class('Animal', {
	
	construct: function(name) {
		this.name = name;
	},
	
	makeNoise: function(noise) {
		alert(noise);
	}
	
});

Class('Person').extends('Animal', {
	
	speak: function(sayWhat) {
		this.makeNoise(this, this.name + ' says: "' + sayWhat + '"');
	}
	
});

var james = new Person('James');
james.makeNoise('Hello, World');
