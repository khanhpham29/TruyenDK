const Handlebars = require('handlebars')
const moment = require('moment')

module.exports = {
    sum: (a, b) => a + b,
    dateFormat: (date,options)=>{
        const formatToUse = (options && options.hash && options.hash.format) || "MM/DD/YYYY"
        return moment(date).format(formatToUse);
    },
    sortTable: (field, sort) =>{
        const sortType = field === sort.column ? sort.type : 'default'
        const icons = {
            default: 'oi oi-elevator',
            asc: 'oi oi-sort-ascending',
            desc: 'oi oi-sort-descending',
        }
        const types = {
            default: 'desc',
            asc : 'desc',
            desc : 'asc',
        }
        const type = types[sortType]
        const icon = icons[sortType]
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`) 

        var output = `<a href="${href}">
                        <span class="${icon}"></span>
                    </a>`
        return new  Handlebars.SafeString(output)
    },
    isdefined: function (value) {
        return value !== 0;
    },
    checkLike: function (value) {
        if(value == 0){
            return false
        }
    },
    if_eq: function (a) {
        if(a > 0){
            return '<button class="btn btn-success btn-add-to-cart" >Thêm vào giỏ hàng</button>'
        }          
        else{
            return '<button class="btn btn-danger btn-add-to-cart disable" >Hết hàng</button>'
        }
    },


    block_unblock_account: function (a) {
        if(a == 'active'){
            return '<a href="#" class="btn btn-danger btn-block-account">Khóa</a>'
        }          
        else{
            return '<a href="#" class="btn btn-success btn-block-account">Mở khóa</a>'
        }
    },
    
    pagination: (currentPage, totalPage, size, options)=>{
        var startPage, endPage, context;
        if (arguments.length === 3) {
            options = size;
            size = 4;
        }

        startPage = currentPage - Math.floor(size / 2);
        endPage = currentPage + Math.floor(size / 2);

        if (startPage <= 0) {
            endPage -= (startPage - 1);
            startPage = 1;
        }

        if (endPage > totalPage) {
            endPage = totalPage;
            if (endPage - size + 1 > 0) {
            startPage = endPage - size + 1;
            } else {
            startPage = 1;
            }
        }

        context = {
            startFromFirstPage: false,
            pages: [],
            endAtLastPage: false,
        };
        if (startPage === 1) {
            context.startFromFirstPage = true;
        }
        for (var i = startPage; i <= endPage; i++) {
            context.pages.push({
            page: i,
            isCurrent: i === currentPage,
            });
        }
        if (endPage === totalPage) {
            context.endAtLastPage = true;
        }
        return options.fn(context)
    }

}