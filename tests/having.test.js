const {builder} = require('../builder')

describe('query where test', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test HAVING '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('having string condition', () => {
        expect(queryBody.having('id = 11').toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('having multiple string condition', () => {
        expect(queryBody.having('id = 11', "name = 'dima'").toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('having object type', () => {
        expect(queryBody.having({id: 11}).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('check protecting value in object type', () => {
        expect(queryBody.having({id: 11, name: 'dima'}).toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('object type multiple objects', () => {
        expect(queryBody.having({id: 11}, {age: 20}).toRawSQL())
            .toBe(baseResult + 'id = 11 AND age = 20')
    })

    it('having in object type', () => {
        expect(queryBody.having({name: ['dima', 'anna', 'util', 'saloEater', 'kirill']}).toRawSQL())
            .toBe(baseResult + "name IN ['dima', 'anna', 'util', 'saloEater', 'kirill']")
    })

    it('having is object type', () => {
        expect(queryBody.having({name: 'IS NULL', age: 'IS NOT NULL'}).toRawSQL())
            .toBe(baseResult + 'name IS NULL AND age IS NOT NULL')
    })

    it('having array type', () => {
        expect(queryBody.having(['name', 'like', 'l']).toRawSQL())
            .toBe(baseResult + "name like 'l'")
    })

    it('having array type equal two param', () => {
        expect(queryBody.having(['id', 11]).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('having array unary operator', () => {
        expect(queryBody.having(['id', 'IS NOT NULL'], ['name', 'IS NULL']).toRawSQL())
            .toBe(baseResult + 'id IS NOT NULL AND name IS NULL')
    })

    it('having array type having NOT IN', () => {
        expect(queryBody.having(['name', 'NOT IN', [1, 'enerGOww', 3, 4]]).toRawSQL())
            .toBe(baseResult + "name NOT IN [1, 'enerGOww', 3, 4]")
    })

    it('having array type having IN 2 value', () => {
        expect(queryBody.having(['id', ['gg', 'wp']]).toRawSQL())
            .toBe(baseResult + "id IN ['gg', 'wp']")
    })

    it('having array type NOT BETWEEN', () => {
        expect(queryBody.having(['id', 'NOT BETWEEN', 10, 15]).toRawSQL())
            .toBe(baseResult + "id NOT BETWEEN 10 AND 15")
    })

    it('having array type BETWEEN no operator', () => {
        expect(queryBody.having(['id', 10, 15]).toRawSQL())
            .toBe(baseResult + "id BETWEEN 10 AND 15")
    })
})