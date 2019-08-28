const Tester = require('../dist/biangvalidator');
console.log(Tester);
/**
 * 
 */
let obj = {
    id: 'asdfasdfas',
    name: 'aasdfasdf',
    age: 145,
    children: [{
        id: 'asdfasdf',
        name: 'ab',
        age: 87,
        children: [{
            id: '1412asdf',
            name: 'sdfsdf',
            age: 54,
        }],
        forTest:[{a:1, b:2, c:3, d:{a:1, zz:2}}, {a:12}, {}]
    }]
}

let tester = new Tester({
    person(val){
        return this.validate(val, {
            'id*': 'string',
            'name*': 'string',
            'age*': 'number',
            children: 'array[person]?',
            forTest: ['object']
        });
    },
});

tester.validate(obj, 'person').then(()=>{
    console.log('checked');
}).catch(err=>{
    console.error(err);
});