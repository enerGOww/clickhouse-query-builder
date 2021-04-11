const {builder} = require('../builder')

describe('query select tests', () => {
    it('base select *', () => {
        expect(builder().select('*').from('test').toRawSQL())
            .toBe('SELECT * FROM test')
    })

    it('select column', () => {
        expect(builder().select('id').from('test').toRawSQL())
            .toBe('SELECT id FROM test')
    })

    it('select column id AS result', () => {
        expect(builder().select('id AS result').from('test').toRawSQL())
            .toBe('SELECT id AS result FROM test')
    })

    it('select multiple columns', () => {
        expect(builder().select('id', 'name', 'time AS date', 'description').from('test').toRawSQL())
            .toBe('SELECT id, name, time AS date, description FROM test')
    })

    it('select default', () => {
        expect(builder().from('test').toRawSQL())
            .toBe('SELECT * FROM test')
    })

    it('select one param', () => {
        expect(builder().select('id, name AS fullname').from('test').toRawSQL())
            .toBe('SELECT id, name AS fullname FROM test')
    })

    it('select distinct', () => {
        expect(builder().selectDistinct('name').from('test').toRawSQL())
            .toBe('SELECT DISTINCT name FROM test')
    })

})