
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import fsPromises from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createLayers } from '../../src/create-layers';
import { createFiles } from '../../src/create-files';

function getFilePaths({ mainPath, layersDir, layers, componentName }) {
    return layers.map(layer => {
        const filename = {
            repository: `${componentName}Repository`,
            service: `${componentName}Service`,
            factory: `${componentName}Factory`
        }[layer]

        return join(mainPath, layersDir, layer, `${filename}.js`)
    })
}

function getMethodsByObject(classObject) {
    return Reflect.ownKeys(Reflect.getPrototypeOf(classObject)).filter((method) => method !== 'constructor')
}


describe('#Files - integration - create', () => {
    const config = {
        mainPath: join(tmpdir(), 'skeleton---'), // /tmp/skeleton--
        layersDir: 'src', // src
        layers: ['repository', 'service', 'factory'],
        componentName: 'heroes'
    }

   beforeAll(async () => {
        await fsPromises.mkdir(config.mainPath, { recursive: true })
        await createLayers({ ...config }) // create layers
        await fsPromises.copyFile(
            join('__tests__', 'integration', 'mocks', 'package.json'),
            join(config.mainPath, config.layersDir, 'package.json') // /tmp/skeleton--/src/package.json to can import files js from src
        )
    })

    afterAll(async () => {
        await fsPromises.rm(config.mainPath, { recursive: true })
    })

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    it('Should create repository with methods read, update, delete and create', async () => {
        const myconfig = { ...config, layers: ['repository']}
        await createFiles(myconfig)

        const [ repositoryFilename ] = getFilePaths(myconfig) // ['/tmp/skeleton--/src/repository/heroesRepository.js']
        
        const { default: Repository} = await import(repositoryFilename) // import file js
        const repository = new Repository()
        const methods = getMethodsByObject(repository)

       const expectNotImplemented = fn => expect(() => fn.call()).rejects.toEqual("method not implemented!")

        methods.forEach((v) => {
            expectNotImplemented(repository[v])
        })
    })
    it('Should create service with methods read, update, delete and create and call repository methods', async () => {
        const myconfig = { ...config, layers: ['repository', 'service']}
        await createFiles(myconfig)

        const [ repositoryFilename, serviceFilename ] = getFilePaths(myconfig) 
        
        const { default: Repository } = await import(repositoryFilename)
        const { default: Service  } = await import(serviceFilename)

        const repository = new Repository()
        const service = new Service({ repository }) // pass repository to service

        //Mock repository methods to success
        getMethodsByObject(repository).forEach((v) => {
            jest.spyOn(repository, v).mockResolvedValue()
        })

        const methodsService = getMethodsByObject(service) // ['read', 'update', 'delete', 'create']

        methodsService.forEach((m) => {
            service[m].call(service, [])
            expect(repository[m]).toBeCalledTimes(1) // check if repository method was called
        })
    })

    it('Should create factory and return instance of service', async () => {
        const myconfig = { ...config }
        await createFiles(myconfig)

        const [ repositoryFilename, serviceFilename, factoryFilename ] = getFilePaths(myconfig) 
        
        const { default: Repository } = await import(repositoryFilename)
        const { default: Service  } = await import(serviceFilename)
        const { default: Factory} = await import(factoryFilename) 

        const repository = new Repository()
        const expectedService = new Service({ repository })

        const service = Factory.getInstance()

        expect(service).toEqual(expectedService)
        expect(service).toBeInstanceOf(Service)
    })
})