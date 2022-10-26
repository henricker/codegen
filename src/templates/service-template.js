import { StringReplacer } from "../utils/string-replace";

const serviceArchor = '$$service$$';
const repositoryAnchor = '$$repositoryName$$';
const contextAnchor = '$$context$$';

const template = `
export default class $$service$$Service {
    constructor({
        repository: $$repositoryName$$
    }) {
        $$context$$ = $$repositoryName$$
    }

    create(data) {
        return $$context$$.create(data)
    }

    update(id, data) {
        return $$context$$.update(id, data)
    }

    delete(id) {
        return $$context$$.delete(id)
    }

    read(id) {
        return $$context$$.read(id)
    }
}`

export function serviceTemplate(componentName, repositoryName) {
    return {
        filename: `${componentName}Service`,
        template: template
            .replaceAll(serviceArchor, StringReplacer.firstLetterToUpperCase(componentName))
            .replaceAll(repositoryAnchor, repositoryName)
            .replaceAll(contextAnchor, `this.${repositoryName}`)
    }
}