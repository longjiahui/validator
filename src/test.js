const Validator = require('../dist/main')
const assert = require('assert')

describe('Validator', function(){
    let validator = new Validator({
        number: val=>{
            return typeof val === 'number'
        }
    })
    it('string', async function(){
        //1 常规字符串
        assert(await validator.validate(1241242, 'number'))
        assert(!await validator.validate('asdfasdf', 'number'))
    })
    it('string-array', async function(){
        assert(await validator.validate([12, 13, 22], 'array[number]'))
        assert(!await validator.validate([12, 'asdf', 23], 'array[number]'))
    })
    it('string-nullable', async function(){
        assert(await validator.validate(null, 'number$'))
        assert(!await validator.validate(null, 'number'))
    })

    it('regexp', async function(){
        assert(await validator.validate('14124$$', /\$$/))
        assert(!await validator.validate('124124', /abc/))
    })

    it('array-and', async function(){
        assert(await validator.validate('14124$$', [/14/, /24/]))
        assert(!await validator.validate('124124', [/abc/, /124/]))
    })
    

    it('checkOr', async function(){
        assert(await validator.checkOr([Promise.resolve(false), Promise.resolve(true)]))
        assert(await validator.checkOr([Promise.resolve(true), Promise.resolve(false)]))
        assert(!await validator.checkOr([Promise.resolve(false), Promise.resolve(false)]))
        assert(await validator.checkOr([Promise.resolve(true), Promise.resolve(true)]))
    })

    it('object-regular', async function(){
        assert(await validator.validate({a: 12412}, {
            a: 'number'
        }))
        assert(!await validator.validate({a: '12412'}, {
            a: 'number'
        }))
    })
    it('object-optional', async function(){
        assert(!await validator.validate({a: 135214, b: 'asdfasdfasdf'}, {
            a: 'number',
            b$: 'number'
        }))
        assert(await validator.validate({a: 135214}, {
            a: 'number',
            b$: 'number'
        }))
        assert(!await validator.validate({a: 135214}, {
            a: 'number',
            b: 'number'
        }))
    })
    it('object-$listItem', async function(){
        assert(!await validator.validate({a: '12512', b: 1241}, {
            $listItem: 'number'
        }))
        assert(validator.validate({a: 125142, b: 124}, {
            $listItem: 'number'
        }))
    })

    it('object-or', async function(){
        assert(await validator.validate(124124, {$or: [val=>val<10, val=>val > 10]}))
        assert(!await validator.validate(124124, {$or: [val=>val<10, val=>val > 124125]}))
    })

    it('object-recursive', async function(){
        // add person rule 
        validator.addPresetRule('person', {
            name: 'truthyString',
            age: 'number',
            children$: 'array[person]$'
        })
        validator.addPresetRule('people', 'array[person]')
        const data = [{
            name: '龙一',
            age: 55,
            children: [{
                name: '龙二',
                age: 32
            }]
        }, {
            name: '落一',
            age: 45,
            children: [{
                name: '落二',
                age: 12
            }]
        }]
        assert(await validator.validate(data, 'people'))
        data[0].name = ''
        assert(!await validator.validate(data, 'people'))
    })

    it('escape-$', async function(){
        // suffix
        assert(!await validator.v({
            a$: 1,
        }, {
            a$$: 'string',
        }))
        assert(await validator.v({
            a$: 1,
        }, {
            a$$: 'number',
        }))

        //prefix
        assert(await validator.v({
            $: 1,
        }, {
            $$: 'number',
        }))
        assert(!await validator.v({
            $listItem: 1,
        }, {
            $$listItem: 'string',
        }))
        assert(await validator.v({
            $listItem: 1,
        }, {
            $$listItem: 'number',
        }))
        assert(await validator.v({
            $$listItem: 1,
        }, {
            $$$listItem: 'number',
        }))
        assert(!await validator.v({
            $$listItem: 1,
        }, {
            $$$listItem: 'string',
        }))
    })
})