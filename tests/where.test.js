const {builder} = require('../builder')

describe('query where test', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test WHERE '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('where string condition', () => {
        expect(queryBody.where('id = 11').toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('where multiple string condition', () => {
        expect(queryBody.where('id = 11', "name = 'dima'").toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('where object type', () => {
        expect(queryBody.where({id: 11}).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('check protecting value in object type', () => {
        expect(queryBody.where({id: 11, name: 'dima'}).toRawSQL())
            .toBe(baseResult + "id = 11 AND name = 'dima'")
    })

    it('object type multiple objects', () => {
        expect(queryBody.where({id: 11}, {age: 20}).toRawSQL())
            .toBe(baseResult + 'id = 11 AND age = 20')
    })

    it('where in object type', () => {
        expect(queryBody.where({name: ['dima', 'anna', 'util', 'saloEater', 'kirill']}).toRawSQL())
            .toBe(baseResult + "name IN ['dima', 'anna', 'util', 'saloEater', 'kirill']")
    })

    it('where is object type', () => {
        expect(queryBody.where({name: 'IS NULL', age: 'IS NOT NULL'}).toRawSQL())
            .toBe(baseResult + 'name IS NULL AND age IS NOT NULL')
    })

    it('where is object type гтвуаштвув', () => {
        expect(queryBody.where({name: 'IS NULL', age: undefined}).toRawSQL())
            .toBe(baseResult + 'name IS NULL')
    })

    it('where array type', () => {
        expect(queryBody.where(['name', 'like', 'l']).toRawSQL())
            .toBe(baseResult + "name like 'l'")
    })

    it('where array type equal two param', () => {
        expect(queryBody.where(['id', 11]).toRawSQL())
            .toBe(baseResult + 'id = 11')
    })

    it('where array unary operator', () => {
        expect(queryBody.where(['id', 'IS NOT NULL'], ['name', 'IS NULL']).toRawSQL())
            .toBe(baseResult + 'id IS NOT NULL AND name IS NULL')
    })

    it('where array type where NOT IN', () => {
        expect(queryBody.where(['name', 'NOT IN', [1, 'enerGOww', 3, 4]]).toRawSQL())
            .toBe(baseResult + "name NOT IN [1, 'enerGOww', 3, 4]")
    })

    it('where array type where IN 2 value', () => {
        expect(queryBody.where(['id', ['gg', 'wp']]).toRawSQL())
            .toBe(baseResult + "id IN ['gg', 'wp']")
    })

    it('where array type NOT BETWEEN', () => {
        expect(queryBody.where(['id', 'NOT BETWEEN', 10, 15]).toRawSQL())
            .toBe(baseResult + "id NOT BETWEEN 10 AND 15")
    })

    it('where array type BETWEEN no operator', () => {
        expect(queryBody.where(['id', 10, 15]).toRawSQL())
            .toBe(baseResult + "id BETWEEN 10 AND 15")
    })
})