const { Schema, model} = require("mongoose");

const productSchema = new Schema({
    title:{ 
        type: String,
        required: true
    },
    image:{ 
        type: String,
        required: true
    },
    brand:{ 
        type: String,
        required: true
    },
    description:{ 
        type: String,
        required: true
    },
    price:{ 
        type: Number,
        required: true,
    },
    categories:[
        { 
          type: Schema.Types.ObjectId, 
          ref: 'Category' 
        }
    ],
});

module.exports =  model('Product', productSchema);