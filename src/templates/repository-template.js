import { StringReplacer } from "../utils/string-replace"

const componentNameAnchor = '$$componentName$$'
const template = `
export default class $$componentName$$Repository {
    constructor() {}

    create(data) {
        return Promise.reject("method not implemented!")
    }

    update(id, data) {
        return Promise.reject("method not implemented!")
    }

    delete(id) {
        return Promise.reject("method not implemented!")
    }

    read(query) {
        return Promise.reject("method not implemented!")
    }
}`

export function repositoryTemplate(componentName) {
    const filename = `${componentName}Repository`
    return {
        filename,
        template: template.replaceAll(componentNameAnchor, StringReplacer.firstLetterToUpperCase(componentName))
    }
}