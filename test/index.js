const Validator = require('../dist/biangvalidator');
console.log(Validator);
/**
 * 
 */


// validator.validate(obj, 'person').then(()=>{
//     console.log('checked');
// }).catch(err=>{
//     console.error(err);
// });
// let obj = {
//     id: 1,
//     name: '张三',
//     age: 34,
//     children: [{
//         id: 2,
//         name: '张子',
//         age: 12,
//     },{
//         id: 3,
//         name: '张女',
//         age: 10,
//     }]
// };

// let validator = new Validator({
//     person:{
//         'id*': 'number',
//         'name*': 'string',
//         'age*': 'number',
//         children: 'array[person]?',
//     },
// });

// validator.validate(obj, 'person',).then(()=>{
//     console.log('checked');
// }).catch(err=>{
//     console.error(err);
// });

let obj = {
    id: 1,
    name: '张三',
    children:[{
        id: 2, 
        name: '张二'
    }]
};
new Validator({
    person:{
        'id*': {or:['number', 'string']},
        'name*': 'string',
        //可以在规则中引用自定义的规则
        children: (val, ctx, validator)=>{
            let _this = this;
            return new Promise((resolve, reject)=>{
                //3s 后返回
                setTimeout(()=>{
                    resolve(validator.validate(val, 'array[person]?'));
                }, 3000);
            });
        },
    }
}).validate(obj, 'person').then(()=>{
    //valid
    console.log('xixi');
}).catch(err=>{
    //invalid
});