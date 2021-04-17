const {builder} = require('../builder')

describe('query prewhere test', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test PREWHERE '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('prewhere string condition', () => {
        expect(queryBody.prewhere('id = 11').toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('prewhere multiple string condition', () => {
        expect(queryBody.prewhere('id = 11', "name = 'dima'").toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('prewhere object type', () => {
        expect(queryBody.prewhere({id: 11}).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('check protecting value in object type', () => {
        expect(queryBody.prewhere({id: 11, name: 'dima'}).toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('object type multiple objects', () => {
        expect(queryBody.prewhere({id: 11}, {age: 20}).toRawSQL())
            .toBe(baseResult + 'id = 11 AND age = 20')
    })

    it('prewhere in object type', () => {
        expect(queryBody.prewhere({name: ['dima', 'anna', 'util', 'saloEater', 'kirill']}).toRawSQL())
            .toBe(baseResult + "name IN ['dima', 'anna', 'util', 'saloEater', 'kirill']")
    })

    it('prewhere is object type', () => {
        expect(queryBody.prewhere({name: 'IS NULL', age: 'IS NOT NULL'}).toRawSQL())
            .toBe(baseResult + 'name IS NULL AND age IS NOT NULL')
    })

    it('prewhere array type', () => {
        expect(queryBody.prewhere(['name', 'like', 'l']).toRawSQL())
            .toBe(baseResult + "name like 'l'")
    })

    it('prewhere array type equal two param', () => {
        expect(queryBody.prewhere(['id', 11]).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('prewhere array unary operator', () => {
        expect(queryBody.prewhere(['id', 'IS NOT NULL'], ['name', 'IS NULL']).toRawSQL())
            .toBe(baseResult + 'id IS NOT NULL AND name IS NULL')
    })

    it('prewhere array type prewhere NOT IN', () => {
        expect(queryBody.prewhere(['name', 'NOT IN', [1, 'enerGOww', 3, 4]]).toRawSQL())
            .toBe(baseResult + "name NOT IN [1, 'enerGOww', 3, 4]")
    })

    it('prewhere array type prewhere IN 2 value', () => {
        expect(queryBody.prewhere(['id', ['gg', 'wp']]).toRawSQL())
            .toBe(baseResult + "id IN ['gg', 'wp']")
    })

    it('prewhere array type NOT BETWEEN', () => {
        expect(queryBody.prewhere(['id', 'NOT BETWEEN', 10, 15]).toRawSQL())
            .toBe(baseResult + "id NOT BETWEEN 10 AND 15")
    })

    it('prewhere array type BETWEEN no operator', () => {
        expect(queryBody.prewhere(['id', 10, 15]).toRawSQL())
            .toBe(baseResult + "id BETWEEN 10 AND 15")
    })
})