const {builder} = require('../builder')

describe('ORDER BY tests', () => {
    let queryBody = builder().from('test')
    const baseResult = 'SELECT * FROM test ORDER BY '

    afterEach(() => {
        queryBody = builder().from('test')
    })

    it('default sort', () => {
        expect(queryBody.orderBy({column: 'age'}, {column: 'name'}).toRawSQL())
            .toBe(baseResult + 'age ASC, name ASC')
    })

    it('check direction', () => {
        expect(queryBody.orderBy({column: 'age', direction: 'ASC'}, {column: 'name', direction: 'DESC'}).toRawSQL())
            .toBe(baseResult + 'age ASC, name DESC')
    })

    it('check collate', () => {
        expect(queryBody.orderBy({column: 'name', direction: 'ASC', collate: 'en'}).toRawSQL())
            .toBe(baseResult + "name ASC COLLATE 'en'")
    })

    it('check with fill', () => {
        expect(queryBody.orderBy({column: 'name', withFill: true}).toRawSQL())
            .toBe(baseResult + 'name ASC WITH FILL')
    })

    it('check collate with fill', () => {
        expect(queryBody.orderBy({column: 'name', direction: 'DESC', collate: 'ru', withFill: true}).toRawSQL())
            .toBe(baseResult + "name DESC COLLATE 'ru' WITH FILL")
    })

    it('check from', () => {
        expect(queryBody.orderBy({column: 'age', from: 18}).toRawSQL())
            .toBe(baseResult + 'age ASC FROM 18')
    })

    it('check to', () => {
        expect(queryBody.orderBy({column: 'age', to: 18}).toRawSQL())
            .toBe(baseResult + 'age ASC TO 18')
    })

    it('check step', () => {
        expect(queryBody.orderBy({column: 'age', step: 2}).toRawSQL())
            .toBe(baseResult + 'age ASC STEP 2')
    })

    it('check from to', () => {
        expect(queryBody.orderBy({column: 'age', from: 18, to: 30}).toRawSQL())
            .toBe(baseResult + 'age ASC FROM 18 TO 30')
    })

    it('check from step', () => {
        expect(queryBody.orderBy({column: 'age', from: 10, step: 5}).toRawSQL())
            .toBe(baseResult + 'age ASC FROM 10 STEP 5')
    })

    it('check to step', () => {
        expect(queryBody.orderBy({column: 'age', to: 40, step: 10}).toRawSQL())
            .toBe(baseResult + 'age ASC TO 40 STEP 10')
    })

    it('check FROM TO STEP', () => {
        expect(queryBody.orderBy({column: 'age', from: 14, to: 21, step: 3}).toRawSQL())
            .toBe(baseResult + 'age ASC FROM 14 TO 21 STEP 3')
    })

    it('check FROM TO STEP WITH FILL', () => {
        expect(queryBody.orderBy({column: 'age', from: 7, to: 18, step: 2, withFill: true}).toRawSQL())
            .toBe(baseResult + 'age ASC WITH FILL FROM 7 TO 18 STEP 2')
    })
})