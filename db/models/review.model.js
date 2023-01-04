const   mongoose  = require("mongoose");

const reviewSchema= mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review can not be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:1
    },
    createAt:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"User",
        required:[true,"review must have a author"]
    },
    product:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"Product",
        required:[true,"review must have a Product id "]
    }

},{
 
});

reviewSchema.pre(/^find/,function(next){
  
    this.populate({
        path:"user",
        select:"fName lName"
    })

    next();
})
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review