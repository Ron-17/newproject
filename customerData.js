const mngs = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt=require("jsonwebtoken")
const schema = mngs.Schema;
const customerSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   /* phone:{
        type:Number,
        required:true
    },
    tn:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },*/
    message:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
        required:true
        }
    }]
},{timestamps:true})
customerSchema.methods.generateauth=async function()
{
    try{
        console.log(this._id)
        const token=await jwt.sign({_id:this._id.toString()},"uggufgwauguwg")
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        console.log(token)
        return token
    }
    catch{
        console.log("error")
    }
}
customerSchema.pre("save", async function(next){
    if(this.isModified("email")){
        this.email=await bcrypt.hash(this.email,4)
    }
    next();
})

const customer = mngs.model('portfolioentries',customerSchema)

/*customerSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
*/
module.exports = customer;