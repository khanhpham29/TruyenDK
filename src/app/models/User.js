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
    }

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
        if(auth){
            return user
        }
        throw Error('Sai tài khoản hoặc mật khẩu')
    }
    throw Error('Sai tài khoản hoặc mật khẩu')
}


module.exports = mongoose.model('user', userSchema)