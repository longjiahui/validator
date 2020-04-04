const Validator = require('../dist/biangvalidator');
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

// let obj = {
//     id: 1,
//     name: '张三',
//     children:[{
//         id: 2, 
//         name: '张二'
//     }]
// };
// new Validator().validate(obj.name, /张s三/).then(()=>{
// }).then(()=>{
//     console.log('ok')
// }).catch(()=>{
//     console.log('fail')
// })
let obj = 
{
  _id: '5e71a12d81d5a72f00cc4abe',
  description: '',
  content: 'test',
  title: 'test',
  category: 'test'
} ;
new Validator({
  a: /test/
}).validate(obj, {
  title: 'a',
  content: 'truthystring',
  category: 'truthystring'
}).then(()=>{
    console.log('valid')
}).catch(err=>{
    console.error(err);
})

new Validator().validate(null, 'string?').then(()=>{
  console.log('valid?')
}).catch((err)=>{
  console.log(err);
})


let obj3 = {
  name: '张三',
  age: 54,
  children: [{
      name: '张四',
      age: 23,
      children: [{
          name: '张五',
          age: 3,
          children: [{
              name: '张六',
              age: 1
          }]
      }]
  }]
}; 
//为了检查出张六缺少了age，而张五的age并非数字可以这么做
new Validator({
  person(val){
      return this.validate(val, {
          name: 'truthyString',
          age: 'number',
          'children?': 'array[person]?',
      })
  }
}).validate(obj3, 'person').then(()=>{
  console.log('valid 3');
}).catch(err=>{
  console.log(err);
});
  

// new Validator({
//     person:{
//         'id*': {or:['number', 'string']},
//         'name*': val=>{return val =='a a'},
//         //可以在规则中引用自定义的规则
//         children: (val, ctx, validator)=>{
//             let _this = this;
//             return new Promise((resolve, reject)=>{
//                 //3s 后返回
//                 setTimeout(()=>{
//                     resolve(validator.validate(val, 'array[person]?'));
//                 }, 3000);
//             });
//         },
//     }
// }).validate(obj, 'person').then(()=>{
//     //valid
//     console.log('xixi');
// }).catch(err=>{
//     //invalid
//     console.error(err);
// });

