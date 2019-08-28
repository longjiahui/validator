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
        }]
    }]
}

let tester = new Tester({
    person(val){
        return this.test(val, {
            'id*': 'string',
            'name*': 'string',
            'age*': 'number',
            children: 'array[person]?',
        });
    },
});

tester.test(obj, 'person').then(()=>{
    console.log('checked');
}).catch(err=>{
    console.error(err);
});