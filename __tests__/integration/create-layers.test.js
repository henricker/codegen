import { describe, it, expect, beforeEach, beforeAll, afterAll, jest } from '@jest/globals'
import fsPromises from 'fs/promises';
import { tmpdir } from 'os'
import { join } from 'path'
import { createLayers } from '../../src/create-layers';

describe('#Layers - integration - create', () => {
    const layers = ['repository', 'service', 'factory'].sort()
    const layersDir = 'src'

    const pathSkeleton = join(tmpdir(), 'skeleton--')
    
    beforeAll(async () => {
        await fsPromises.mkdir(pathSkeleton, { recursive: true })
    })

    afterAll(async () => {
        await fsPromises.rm(pathSkeleton, { recursive: true })
    })

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    it('Should create layers if not exists', async () => {
        const beforeRun = await fsPromises.readdir(pathSkeleton) // []

        await createLayers({ mainPath: pathSkeleton, layersDir, layers })
        
        const afterRun = await fsPromises.readdir(pathSkeleton)
        const afterRunInsideSrc = await fsPromises.readdir(join(pathSkeleton, layersDir)) // ['repository', 'service', 'factory']
        expect(afterRun).not.toStrictEqual(beforeRun) // [] !== ['src']
        expect(afterRunInsideSrc).toEqual(layers)
    })
    it('Should not create layers if already exists', async () => {
        const beforeRun = await fsPromises.readdir(pathSkeleton) // ['src']

        await createLayers({ mainPath: pathSkeleton, layersDir, layers })
        
        const afterRun = await fsPromises.readdir(pathSkeleton)
        const afterRunInsideSrc = await fsPromises.readdir(join(pathSkeleton, layersDir)) // ['repository', 'service', 'factory']
        expect(afterRun).toStrictEqual(beforeRun) // ['src'] === ['src']
        expect(afterRunInsideSrc).toEqual(layers)
    })
})