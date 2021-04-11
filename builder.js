function builder() {
    let selectValue = '*'
    let fromValue = ''
    const whereValues = []
    const orderByValues = []
    const limitValues = {
        limit: null,
        offset: 0,
        withTies: false
    }

    const handleArrayCondition = (condition) => {
        const column = condition[0]
        let operator
        let value
        if (condition.length === 2) {
            operator = getOperatorForValue(condition[1])
            if (isUnaryOperator(operator)) return whereValues.push(`${column} ${operator}`)
            value = Array.isArray(condition[1])
                ? getStringArray(condition[1])
                : protectValue(condition[1])
        }
        if (condition.length === 3) {
            if (typeof condition[1] === 'number' && typeof condition[2] === 'number')
                return whereValues.push(`${column} BETWEEN ${condition[1]} AND ${condition[2]}`)
            operator = condition[1]
            value = Array.isArray(condition[2])
                ? getStringArray(condition[2])
                : protectValue(condition[2])
        }
        if (condition.length === 4) {
            operator = condition[1]
            value = `${condition[2]} AND ${condition[3]}`
        }
        return whereValues.push(`${column} ${operator} ${value}`)
    }
    const handleObjectCondition = (condition) => {
        for (const column in condition) {
            const operator = getOperatorForValue(condition[column])
            if (isUnaryOperator(operator)) {
                whereValues.push(`${column} ${condition[column]}`)
                continue
            }
            if (Array.isArray(condition[column])) {
                const value = getStringArray(condition[column])
                whereValues.push(`${column} ${operator} ${value}`)
                continue
            }
            whereValues.push(`${column} = ${protectValue(condition[column])}`)
        }
    }
    const buildLimit = () => {
        if (!limitValues.limit && !limitValues.offset) return ''
        if (!limitValues.limit && limitValues.offset) return `LIMIT ${limitValues.offset}`
        let result = `LIMIT ${limitValues.offset}, ${limitValues.limit}`
        result += limitValues.withTies ? ' WITH TIES' : ''
        return result
    }

    return {
        select(...columns) {
            selectValue = columns.reduce((res, val) => res += `, ${val}`)
            return this
        },
        from(tableName) {
            fromValue = tableName
            return this
        },
        where(...whereConditions) {
            whereConditions.forEach((whereCondition) => {
                if (typeof whereCondition === 'string') return whereValues.push(whereCondition)
                if (Array.isArray(whereCondition)) return handleArrayCondition(whereCondition)
                if (typeof whereCondition === 'object') return handleObjectCondition(whereCondition)
            })
            return this
        },
        orderBy(...conditions) {
            conditions.forEach((condition) => {
                const {column, direction, collate, withFill, from, to, step} = condition
                let result = column
                result += direction ? ` ${direction}`.toUpperCase() : ' ASC'
                result += collate ? ` COLLATE ${protectValue(collate)}` : ''
                result += withFill ? ' WITH FILL' : ''
                result += from ? ` FROM ${from}` : ''
                result += to ? ` TO ${to}` : ''
                result += step ? ` STEP ${step}` : ''
                orderByValues.push(result)
            })
            return this
        },
        limit(value, withTies = false) {
            if (typeof value === 'number') limitValues.limit = value
            if (Array.isArray(value)) {
                limitValues.limit = value[1]
                limitValues.offset = value[0]
            }
            limitValues.withTies = withTies
            return this
        },
        offset(value) {
            limitValues.offset = value
            return this
        },
        toRawSQL() {
            let result = `SELECT ${selectValue} FROM ${fromValue}`
            const whereResult = whereValues.length ? whereValues.reduce((res, val) => res += ` AND ${val}`) : ''
            result += whereResult ? ` WHERE ${whereResult}` : ''
            const orderByResult = orderByValues.length ? orderByValues.reduce((res, val) => res += `, ${val}`) : ''
            result += orderByResult ? ` ORDER BY ${orderByResult}` : ''
            const limitResult = buildLimit()
            result += limitResult ? ` ${limitResult}` : ''

            return result
        },
        toPromise(client) {
            return client.query(this.toRawSQL()).toPromise()
        },
        exec(client, callback) {
            return client.query(this.toRawSQL()).exec(callback)
        },
        stream(client) {
            return client.query(this.toRawSQL()).stream()
        }
    }
}

function getStringArray(array) {
    const arrayBody = array.reduce((res, val) => res += `${protectValue(val)}, `, '').slice(0, -2)
    return `[${arrayBody}]`
}
function protectValue(value) {
    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'number') return value
}

function getOperatorForValue(operatorOrValue) {
    if (Array.isArray(operatorOrValue)) return 'IN'
    if (typeof operatorOrValue === 'number') return '='
    const upperCase = operatorOrValue.toUpperCase()
    return upperCase === 'IS NULL' || upperCase === 'IS NOT NULL' ? upperCase : '='
}

function isUnaryOperator(operator) {
    const operators = ['IS NULL', 'IS NOT NULL']
    return operators.indexOf(operator.toUpperCase()) !== -1
}

module.exports = {
    builder
}