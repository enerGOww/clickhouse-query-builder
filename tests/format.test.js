const {builder} = require('../builder')

describe('FORMAT', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test FORMAT '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('json', () => {
        expect(queryBody.format('JSON').toRawSQL())
            .toBe(baseResult + 'JSON')
    })
})