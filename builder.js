const builder = () => {
    let selectValue = ''
    let from = ''
    let whereResult = []

    return {
        select(...columns) {
            selectValue = columns.reduce((res, val) => res += `, ${val}`, '')
            return this
        },
        from(tableName) {
            from = tableName
            return this
        },
        where(...whereConditions) {
            whereConditions.forEach(whereCondition => {
                if (typeof whereCondition === 'string') {
                    return whereResult.push(whereCondition)
                }
                if (Array.isArray(whereCondition)) {
                    const column = whereCondition[0]
                    const operator = whereCondition.length === 2 ? '=' : whereCondition[1]
                    const value = whereCondition.length === 3
                        ? whereCondition[2]
                        : `${whereCondition[2]} AND ${whereCondition[3]}` //TODO is null and is not null
                    return whereResult.push(`${column} ${operator} ${value}`)
                }
                if (typeof whereCondition === 'object') {
                    for (const column in whereCondition) {
                        whereResult.push(`${column} = ${whereCondition[column]}`)
                    }
                }
            })
            return this
        }
    }
}
