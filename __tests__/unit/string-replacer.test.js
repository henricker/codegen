import {
    describe,
    it,
    expect,
} from '@jest/globals'
import { StringReplacer } from '../../src/utils/string-replace'


describe('#StringReplacer', () => {
    it('Should transform a first letter of string to uppercase', () => {
        const str = 'hello'
        const expected = 'Hello'

        const result = StringReplacer.firstLetterToUpperCase(str)

        expect(result).toBe(expected)
    })

    it('Should transform a first letter of string to lowercase', () => {
        const str = 'Hello'
        const expected = 'hello'

        const result = StringReplacer.firstLetterToLowerCase(str)

        expect(result).toBe(expected)
    })

    it('Should return empty string if string is empty on firstLetterToLowerCase', () => {
        const str = ''
        const expected = ''

        const result = StringReplacer.firstLetterToLowerCase(str)

        expect(result).toBe(expected)
    })

    it('Should return empty string if string is empty on firstLetterToUpperCase', () => {
        const str = ''
        const expected = ''

        const result = StringReplacer.firstLetterToUpperCase(str)

        expect(result).toBe(expected)
    })
})