const mongoose = require('mongoose')
const { isEmail} = require('validator')
const bcrypt = require('bcrypt')


const Schema = mongoose.Schema
const userSchema =  new Schema({
    email:{ 
        type: String, 
        required: [true, 'Vui lòng nhập Email'],
        unique: true,
        lowercase: true,
        validate:[ isEmail, 'Vui lòng nhập email hợp lệ']
    },
    password:{ 
        type: String, 
        required: [true, 'Vui lòng nhập mật khẩu'],
        minLength: [6, 'Mật khẩu ít nhất phải có 6 ký tự'],
    },
<<<<<<< HEAD
=======
    name: {
        type: String,
    },
    phone: {
        type: String,
        //required: [true, 'Vui lòng nhập số điện thoại'],
        lenghth: [10, 'Phone có phải có 10 số'],
    },
>>>>>>> dat
    role:{ 
        type: String,
        default: 'member',
    }
<<<<<<< HEAD
=======
},{
    collection: 'users'
>>>>>>> dat
})

// kích hoạt một chức năng trước khi dữ liệu được lưu vào db
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt()
    this.password  = await bcrypt.hash(this.password, salt)
    next()
})

<<<<<<< HEAD
=======

>>>>>>> dat
// phương thức tĩnh để đăng nhập người dùng
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if (user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('Sai tài khoản hoặc mật khẩu')
    }
    throw Error('Sai tài khoản hoặc mật khẩu')
}


<<<<<<< HEAD
=======

userSchema.methods.addToCart = async function(manga, rentalIds){
    let cart = this.cart
    let renArr = {
        rendId: rentalIds,
        quantity: 1
    }
    //Nếu cart chưa có manga nào
    if(cart.items.length == 0){
        cart.items.push(
            {
                mangaId: manga._id, 
                rentalIds: renArr
            }
        )
        cart.totalPrice = manga.price
    }
    //Nếu cart đã tồn tại manga
    else{
        //Kiểm tra xem tập manga đã tồn tại chưa
        const existingManga= cart.items.rentalIds
        console.log('existingMangaIndex:', existingManga)
    }
    console.log('đây là user:',this.cart)
    return this.save()
}

>>>>>>> dat
module.exports = mongoose.model('user', userSchema)