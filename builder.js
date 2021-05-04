function builder(client = {}) {
    let selectValue = '*'
    let fromValue = ''
    let sampleValue = ''
    const prewhereValues = []
    const whereValues = []
    const havingValues = []
    const orderByValues = []
    const limitByValues = {
        limit: null,
        offset: 0,
        expression: ''
    }
    const limitValues = {
        limit: null,
        offset: 0,
        withTies: false
    }
    let groupByValue = ''
    let formatValue = ''

    const handleArrayCondition = (condition, array) => {
        const column = condition[0]
        let operator
        let value
        if (condition.length === 2) {
            operator = getOperatorForValue(condition[1])
            if (isUnaryOperator(operator)) return array.push(`${column} ${operator}`)
            value = Array.isArray(condition[1])
                ? getStringArray(condition[1])
                : protectValue(condition[1])
        }
        if (condition.length === 3) {
            if (typeof condition[1] === 'number' && typeof condition[2] === 'number')
                return array.push(`${column} BETWEEN ${condition[1]} AND ${condition[2]}`)
            operator = condition[1]
            value = Array.isArray(condition[2])
                ? getStringArray(condition[2])
                : protectValue(condition[2])
        }
        if (condition.length === 4) {
            operator = condition[1]
            value = `${condition[2]} AND ${condition[3]}`
        }
        return array.push(`${column} ${operator} ${value}`)
    }
    const handleObjectCondition = (condition, array) => {
        for (const column in condition) {
            const operator = getOperatorForValue(condition[column])
            if (isUnaryOperator(operator)) {
                array.push(`${column} ${condition[column]}`)
                continue
            }
            if (Array.isArray(condition[column])) {
                const value = getStringArray(condition[column])
                array.push(`${column} ${operator} ${value}`)
                continue
            }
            array.push(`${column} = ${protectValue(condition[column])}`)
        }
    }
    const buildLimitBy = () => {
        if (!limitByValues.expression) return ''
        let result = `LIMIT ${limitByValues.offset}, ${limitByValues.limit}`
        result += ` BY ${limitByValues.expression}`
        return result
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
            selectValue = columns.reduce((r, v) => r += `, ${v}`)
            return this
        },
        selectDistinct(...columns) {
            selectValue = `DISTINCT ${columns.reduce((r, v) => r += `, ${v}`)}`
            return this
        },
        from(tableName) {
            fromValue = tableName
            return this
        },
        sample(sample, offset) {
            sampleValue = sample
            sampleValue += offset ? ` OFFSET ${offset}` : ''
            return this
        },
        prewhere(...conditions) {
            conditions.forEach((condition) => {
                if (typeof condition === 'string') return prewhereValues.push(condition)
                if (Array.isArray(condition)) return handleArrayCondition(condition, prewhereValues)
                if (typeof condition === 'object') return handleObjectCondition(condition, prewhereValues)
            })
            return this
        },
        where(...conditions) {
            conditions.forEach((condition) => {
                if (typeof condition === 'string') return whereValues.push(condition)
                if (Array.isArray(condition)) return handleArrayCondition(condition, whereValues)
                if (typeof condition === 'object') return handleObjectCondition(condition, whereValues)
            })
            return this
        },
        having(...conditions) {
            conditions.forEach((condition) => {
                if (typeof condition === 'string') return havingValues.push(condition)
                if (Array.isArray(condition)) return handleArrayCondition(condition, havingValues)
                if (typeof condition === 'object') return handleObjectCondition(condition, havingValues)
            })
            return this
        },
        groupBy(...args) {
            const lastIndex = args.length - 1
            args.forEach((arg, i) => {
                if (Array.isArray(arg)) return groupByValue += arg.reduce((res, val) => res += `, ${val}`)
                if (i === lastIndex && isGroupByMod(arg)) return groupByValue += ` ${arg.toUpperCase()}`
                groupByValue += groupByValue ? `, ${arg}` : arg
            })
            return this
        },
        format(format) {
            formatValue = format
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
        limitBy(value, expressions) {
            if (typeof value === 'number') limitByValues.limit = value
            if (Array.isArray(value)) {
                limitByValues.limit = value[1]
                limitByValues.offset = value[0]
            }
            if (Array.isArray(expressions)) limitByValues.expression = expressions.reduce((r, v) => r += `, ${v}`)
            else limitByValues.expression = expressions
            return this
        },
        offsetBy(value) {
            limitByValues.offset = value
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

            result += sampleValue ? ` SAMPLE ${sampleValue}` : ''

            const prewhereResult = prewhereValues.length ? prewhereValues.reduce((r, v) => r += ` AND ${v}`) : ''
            result += prewhereResult ? ` PREWHERE ${prewhereResult}` : ''

            const whereResult = whereValues.length ? whereValues.reduce((r, v) => r += ` AND ${v}`) : ''
            result += whereResult ? ` WHERE ${whereResult}` : ''

            const orderByResult = orderByValues.length ? orderByValues.reduce((r, v) => r += `, ${v}`) : ''
            result += groupByValue ? ` GROUP BY ${groupByValue}` : ''

            const havingResult = havingValues.length ? havingValues.reduce((r, v) => r += ` AND ${v}`) : ''
            result += havingResult ? ` HAVING ${havingResult}` : ''

            result += orderByResult ? ` ORDER BY ${orderByResult}` : ''

            const limitByResult = buildLimitBy()
            result += limitByResult ? ` ${limitByResult}` : ''

            const limitResult = buildLimit()
            result += limitResult ? ` ${limitResult}` : ''

            result += formatValue ? ` FORMAT ${formatValue}` : ''

            return result
        },
        toPromise() {
            return client.query(this.toRawSQL()).toPromise()
        },
        exec(callback) {
            return client.query(this.toRawSQL()).exec(callback)
        },
        stream() {
            return client.query(this.toRawSQL()).stream()
        }
    }
}

function getStringArray(array) {
    const arrayBody = array.reduce((r, v) => r += `${protectValue(v)}, `, '').slice(0, -2)
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

function isGroupByMod(value) {
    const mods = ['WITH ROLLUP', 'WITH TOTALS', 'WITH CUBE']
    return mods.indexOf(value.toUpperCase()) !== -1
}

module.exports = {
    builder
}