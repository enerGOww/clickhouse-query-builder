const {builder} = require('../builder')

describe('LIMIT BY', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test LIMIT '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('limitBy', () => {
        expect(queryBody.limitBy(5, 'id').toRawSQL())
            .toBe(baseResult + '0, 5 BY id')
    })

    it('offset only ignoring', () => {
        expect(queryBody.offsetBy(5).toRawSQL())
            .toBe(baseResult.slice(0, -7))
    })

    it('limit offset by 2 methods', () => {
        expect(queryBody.limitBy(5, 'id').offsetBy(10).toRawSQL())
            .toBe(baseResult + '10, 5 BY id')
    })

    it('limit offset by limit By', () => {
        expect(queryBody.limitBy([2, 5], 'id').toRawSQL())
            .toBe(baseResult + '2, 5 BY id')
    })

    it('limit by array expressions', () => {
        expect(queryBody.limitBy(5, ['id', 'name']).toRawSQL())
            .toBe(baseResult + '0, 5 BY id, name')
    })

    it('limit offset by array expressions', () => {
        expect(queryBody.limitBy([5, 10], ['id', 'name']).toRawSQL())
            .toBe(baseResult + '5, 10 BY id, name')
    })

    it('limit offset array expressions by 2 methods', () => {
        expect(queryBody.limitBy(7, ['id', 'name']).offsetBy(1).toRawSQL())
            .toBe(baseResult + '1, 7 BY id, name')
    })
})