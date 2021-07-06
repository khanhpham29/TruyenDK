const Handlebars = require('handlebars')
const moment = require('moment')

module.exports = {
    sum: (a, b) => a + b,
    dateFormat: (date,options)=>{
        const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "dd MM/DD/YYYY HH:mm:ss"
        return moment(date).format(formatToUse);
    },
    sortTable: ( field, sort) =>{
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
}