const mongoose = require('mongoose')
const { isEmail} = require('validator')
const bcrypt = require('bcrypt')
const book_model = require('../models/book')

const Schema = mongoose.Schema
const userSchema =  new Schema({
    email:{ 
        type: String, 
        required: [true, 'Vui lòng nhập Email'],
        unique: true,
        lowercase: true,
        validate:[ isEmail, 'Vui lòng nhập email hợp lệ'],
    },
    password:{ 
        type: String, 
        required: [true, 'Vui lòng nhập mật khẩu'],
        minLength: [6, 'Mật khẩu ít nhất phải có 6 ký tự'],
    },
    name:{ 
        type: String,
        required: [true, 'Vui lòng nhập tên'],
        maxLength: [25, 'Tên quá dài vui lòng nhập lại']
    },
    phone:{ 
        type: String,
        required: [true, 'Vui lòng nhập Số điện thoại'],
        minLength:[10, 'Số điện thoại ít nhất phải có 10 số'],
    },
    role:{ 
        type: String,
        default: 'member',
    },
    cart:{
        items:[{
            bookId:{
                type: Schema.Types.ObjectId,
                ref: 'book',
                required: true,
            },
            amount:{ 
                type: Number,
                required: true,
            }
        }],
        totalPrice: {
            type: Number,
        },
        totalItem: {
            type: Number,
            default: 0,
        }
    }
},{
    collection: 'users'
})

// kích hoạt một chức năng trước khi dữ liệu được lưu vào db
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt()
    this.password  = await bcrypt.hash(this.password, salt)
    next()
})
// phương thức tĩnh để đăng nhập người dùng
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if (user){

        const auth = await bcrypt.compare(password, user.password)
        console.log(auth)
        console.log(password)
        if(auth){
            return user
        }
        throw Error('Sai tài khoản hoặc mật khẩu')
    }
    throw Error('Sai tài khoản hoặc mật khẩu')
}
userSchema.methods.addToCart = async function (bookId){
    const book = await book_model.findById(bookId)
    if (book) {
        var cart = this.cart
        if(cart.items.length == 0 ){
            cart.items.push({bookId: book._id, amount: 1})
            cart.totalPrice = book.giathue
            cart.totalItem += 1
        }else{
            const isExisting = cart.items.findIndex(objInItems => {
                return new String(objInItems.bookId).trim() == String(book._id).trim()
            }) 
            if( isExisting >= 0 ){
                cart.items[isExisting].amount += 1
            }else{
                cart.items.push({bookId: book._id, amount: 1})
                
            }
            if(!cart.totalPrice){
                cart.totalPrice = 0
            }
            cart.totalPrice += book.giathue
            cart.totalItem += 1
        }
        // console.log('User in schema ', this.cart)   
        return this.save()
    }
    
}
userSchema.methods.removeInCart = async function (itemId){
    const cart = this.cart   
    const isExisting = cart.items.findIndex(objInItems => {
        return new String(objInItems.bookId).trim() == String(itemId).trim()
    })
    const book = await book_model.findById(cart.items[isExisting].bookId)
    if(isExisting >= 0 ){
        cart.totalPrice -= book.giathue * cart.items[isExisting].amount
        cart.totalItem -= cart.items[isExisting].amount
        cart.items.splice(isExisting, 1)
        return this.save()
    }
}


module.exports = mongoose.model('user', userSchema)