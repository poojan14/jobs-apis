const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const User3Schema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'please provide name'],
            maxlength:50,
            minlength:3,
        },
        email:{
            type:String,
            required:[true,'please provide email'],
            maxlength:25,
            unique:true,
            match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',],
        },
        password:{
            type:String,
            required:[true,'please provide password'],
            minlength:6,
        },
    }
)
User3Schema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
User3Schema.methods.createJWT= function(){
    return jwt.sign({
        userId:this._id,name:this.name
    },
    process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME
    }
    )
}

User3Schema.methods.comparePassword= async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}
module.exports=mongoose.model('User',User3Schema)