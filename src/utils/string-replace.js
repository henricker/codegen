
export class StringReplacer {
    
    static #transform(str, isUpperCase = true) {
        if (str?.length === 0) return ''
        const [firstLetter, ...rest] = str;
        const newFirstLetter = isUpperCase ? firstLetter.toUpperCase() : firstLetter.toLowerCase();

        return newFirstLetter + rest.join('');
    }

    static firstLetterToUpperCase(str) {
        return StringReplacer.#transform(str, true);
    }

    static firstLetterToLowerCase(str) {
        return StringReplacer.#transform(str, false);
    }
}