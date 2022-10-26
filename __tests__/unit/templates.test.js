import { describe, it, expect, beforeEach, jest } from '@jest/globals'

import templates from '../../src/templates'
import mockTemplates from './mocks'

const {
    repositoryTemplate,
    serviceTemplate,
    factoryTemplate
} = templates

const {
    repositoryTemplateMock,
    serviceTemplateMock,
    factoryTemplateMock
} = mockTemplates


describe('#Codegen 3-layers arch', () => {
    const componentName = 'product'
    const repositoryName = `${componentName}Repository`
    const serviceName = `${componentName}Service`
    const factoryName = `${componentName}Factory`

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    it('Should generate a repository template', () => {
        const expected = {
            filename: repositoryName,
            template: repositoryTemplateMock
        }

        const result = repositoryTemplate(componentName)

        expect(result).toStrictEqual(expected)
    })

    it('Should generate a service template', () => {
        const expected = {
            filename: serviceName,
            template: serviceTemplateMock
        }

        const result = serviceTemplate(componentName, repositoryName)

        expect(result).toStrictEqual(expected)
    })

    it('Should generate a factory template', () => {
        const expected = {
            filename: factoryName,
            template: factoryTemplateMock
        }

        const result = factoryTemplate(componentName, repositoryName, serviceName)

        expect(result).toStrictEqual(expected)
    })
})