const Validator = require('./dist/index')

const validator = new Validator({
    // 指定一些具名测试函数
    mobile(val){
        return /^1[3456789]\d{9}$/.test(val) 
    }
})

;(async ()=>{
    const valid = await validator.validate('15600001111', 'mobile')
        

    console.log(await  validator.validate({
        a: '12',
        b: 12,
        c: null
    }, {
        a: 'string',
        b: 'number',
        c: null
    }))
})()
