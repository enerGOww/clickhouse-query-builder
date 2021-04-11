const {builder} = require('../builder')

describe('GROUP BY', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test GROUP BY '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('base group by', () => {
        expect(queryBody.groupBy('age').toRawSQL())
            .toBe(baseResult + 'age')
    })

    it('multiple group by', () => {
        expect(queryBody.groupBy('age', 'name').toRawSQL())
            .toBe(baseResult + 'age, name')
    })

    it('group by WITH ROLLUP', () => {
        expect(queryBody.groupBy('age', 'with rollup').toRawSQL())
            .toBe(baseResult + 'age WITH ROLLUP')
    })

    it('group by WITH CUBE', () => {
        expect(queryBody.groupBy('age', 'WITH CUBE').toRawSQL())
            .toBe(baseResult + 'age WITH CUBE')
    })

    it('group by WITH TOTALS', () => {
        expect(queryBody.groupBy('age', 'WITH TOTALS').toRawSQL())
            .toBe(baseResult + 'age WITH TOTALS')
    })

    it('group by array WITH ROLLUP', () => {
        expect(queryBody.groupBy(['year', 'month', 'day'], 'with rollup').toRawSQL())
            .toBe(baseResult + `year, month, day WITH ROLLUP`)
    })

    it('group by array WITH CUBE', () => {
        expect(queryBody.groupBy(['year', 'month', 'day'], 'WITH CUBE').toRawSQL())
            .toBe(baseResult + 'year, month, day WITH CUBE')
    })

    it('group by array WITH TOTALS', () => {
        expect(queryBody.groupBy(['year', 'month', 'day'], 'WITH TOTALS').toRawSQL())
            .toBe(baseResult + 'year, month, day WITH TOTALS')
    })
})