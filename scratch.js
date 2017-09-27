// make an empty object
var myObject = {};

// set the "list1" property to an array of strings
myObject.list1 = ['1', '2'];

// you can also access properties by string
myObject['list2'] = [];
// accessing arrays is the same, but the keys are numbers
myObject.list2[0] = 'a';
myObject['list2'][1] = 'b';

myObject.list3 = [];
// instead of placing properties at specific indices, you
// can push them on to the end
myObject.list3.push({});
// or unshift them on to the beginning
myObject.list3.unshift({});
myObject.list3[0]['key1'] = 'value1';
myObject.list3[1]['key2'] = 'value2';

myObject.not_a_list = '11';