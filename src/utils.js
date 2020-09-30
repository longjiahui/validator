module.exports = {
    checkAnd(promises){
        return Promise.all(promises).then(reses=>{
            return !reses.includes(false)
        })
    },
    // a||b <==> !(!a&&!b)
    checkOr(promises){
        function invert(promise){
            return promise.then(res=>!res)
        }
        return invert(this.checkAnd(promises?.map(p=>invert(p))))
    }
}