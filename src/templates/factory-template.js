import { StringReplacer } from "../utils/string-replace.js"

const repositoryNameAnchor = '$$repositoryName$$'
const serviceNameAnchor = '$$serviceName$$'

const repositoryDependencyAnchor = '$$repositoryDependency$$'
const serviceDependencyAnchor = '$$serviceDependency$$'

const factoryNameAnchor = '$$factory$$'

const template = `
import $$repositoryName$$ from '../repository/$$repositoryDependency$$'
import $$serviceName$$ from '../service/$$serviceDependency$$'

export default class $$factory$$Factory {
    static getInstance() {
        const $$repositoryDependency$$ = new $$repositoryName$$()
        return new $$serviceName$$({ repository: $$repositoryDependency$$ })
    }
}
`

export function factoryTemplate(componentName, repositoryName, serviceName) {
    return {
        filename: `${componentName}Factory`,
        template: template
            .replaceAll(repositoryNameAnchor, StringReplacer.firstLetterToUpperCase(repositoryName))
            .replaceAll(serviceNameAnchor, StringReplacer.firstLetterToUpperCase(serviceName))
            .replaceAll(repositoryDependencyAnchor, StringReplacer.firstLetterToLowerCase(repositoryName))
            .replaceAll(serviceDependencyAnchor, StringReplacer.firstLetterToLowerCase(serviceName))
            .replaceAll(factoryNameAnchor, StringReplacer.firstLetterToUpperCase(componentName))
            .replaceAll(serviceName, serviceName)
    }
}