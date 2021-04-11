const {builder} = require('../builder')

describe('LIMIT OFFSET', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test LIMIT '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('limit', () => {
        expect(queryBody.limit(5).toRawSQL())
            .toBe(baseResult + '0, 5')
    })

    it('offset', () => {
        expect(queryBody.offset(5).toRawSQL())
            .toBe(baseResult + '5')
    })

    it('limit offset by 2 methods', () => {
        expect(queryBody.limit(5).offset(10).toRawSQL())
            .toBe(baseResult + '10, 5')
    })

    it('limit offset by limit', () => {
        expect(queryBody.limit([2, 5]).toRawSQL())
            .toBe(baseResult + '2, 5')
    })

    it('limit WITH TIES', () => {
        expect(queryBody.limit(5, true).toRawSQL())
            .toBe(baseResult + '0, 5 WITH TIES')
    })

    it('limit offset WITH TIES', () => {
        expect(queryBody.limit([5, 10], true).toRawSQL())
            .toBe(baseResult + '5, 10 WITH TIES')
    })

    it('limit offset WITH TIES by 2 methods', () => {
        expect(queryBody.limit(7, true).offset(1).toRawSQL())
            .toBe(baseResult + '1, 7 WITH TIES')
    })
})