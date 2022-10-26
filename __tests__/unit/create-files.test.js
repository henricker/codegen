
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import fsPromises from 'fs/promises';
import { createFiles } from '../../src/create-files';
import templates from '../../src/templates';

function layers(layer) {
    return {
        repository: ['repository'],
        service: ['repository', 'service'],
        factory: ['repository', 'service', 'factory']
    }[layer]
}

describe('#Layers - create', () => {
    const layersDir = 'src'
    const mainPath = './'

    const componentName = 'heroes'
    const repositoryname = `${componentName}Repository`
    const servicename = `${componentName}Service`
    const factoryname = `${componentName}Factory`

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })
    
    it('Should return error if layer doesnt exists', async () => {
        const error = await createFiles({ mainPath, layersDir, layers: ['notExists'], componentName: 'notExists'})

        expect(error).toStrictEqual({
            error: 'Layer doesnt exists'
        })
    })
    it('Should create a repository file', async () => {
        const writeFileSpy = jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue();
        const repositoryTemplateSpy = jest.spyOn(templates, templates.repositoryTemplate.name).mockReturnValue({
            filename: repositoryname,
            template: ''
        })

        const result = await createFiles({ mainPath, layersDir, layers: layers('repository'), componentName })

        expect(writeFileSpy).toHaveBeenCalledTimes(1)
        expect(repositoryTemplateSpy).toHaveBeenCalledWith(componentName)
        expect(result).toStrictEqual({ success: true })
    })
    it('Should create a service file with repository as dependency', async () => {
        const writeFileSpy = jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue();
        const serviceTemplateSpy = jest.spyOn(templates, templates.serviceTemplate.name).mockReturnValue({
            filename: servicename,
            template: ''
        })
        jest.spyOn(templates, templates.repositoryTemplate.name).mockReturnValue({
            filename: repositoryname,
            template: ''
        })

        const result = await createFiles({ mainPath, layersDir, layers: layers('service'), componentName })

        expect(writeFileSpy).toHaveBeenCalledTimes(2)
        expect(serviceTemplateSpy).toHaveBeenCalledWith(componentName, repositoryname)
        expect(result).toStrictEqual({ success: true })
    })
    it('Should create a factory with repository and service as dependencies', async () => {
        const writeFileSpy = jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue();
        const factorySpy = jest.spyOn(templates, templates.factoryTemplate.name).mockReturnValue({
            filename: factoryname,
            template: ''
        })
        jest.spyOn(templates, templates.serviceTemplate.name).mockReturnValue({
            filename: servicename,
            template: ''
        })
        jest.spyOn(templates, templates.repositoryTemplate.name).mockReturnValue({
            filename: repositoryname,
            template: ''
        })


        const result = await createFiles({ mainPath, layersDir, layers: layers('factory'), componentName })

        expect(writeFileSpy).toHaveBeenCalledTimes(3)
        expect(factorySpy).toHaveBeenCalledWith(componentName, repositoryname, servicename)
        expect(result).toStrictEqual({ success: true })
    })
})