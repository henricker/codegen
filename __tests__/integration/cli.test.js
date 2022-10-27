import {
    describe,
    it,
    expect,
    afterEach,
    jest
} from '@jest/globals'
import { join } from 'path';
import { tmpdir } from 'os';
import fsPromises from 'fs/promises'

import { CliControllerFluent } from '../../src/cli/cli.js'

const { mock, fn } = jest;

mock('yargs', () => fn().mockReturnValue({
    argv: { component: ['heroes'] }
}))


describe('Cli - CliControllerFluent - Integration', () => {

    const config = {
        mainPath: join(tmpdir(), 'skeleton---'), 
        layersDir: 'src',
        layers: ['repository', 'service', 'factory'],
    }

    beforeAll(async () => {
        await fsPromises.mkdir(config.mainPath, { recursive: true })
    })

    afterAll(async () => {
        await fsPromises.rm(config.mainPath, { recursive: true })
    })

    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks();
    })

    it('Should throw error if no component is provided', async () => {
        const sut = new CliControllerFluent()
        const error = new Error('You must inform at least one component')
        expect(() => sut.getData()).toThrow(error)
    })

    it('Should create files by command cli', async () => {
        const sut = new CliControllerFluent()

        process.argv.push('--component', 'heroes')

        await sut.getData()
            .execute(config)

        const layerDir = join(config.mainPath, config.layersDir)
        const layers = await fsPromises.readdir(layerDir)

        const files = await Promise.all(layers.map(async (layer) => {
            const layerPath = join(layerDir, layer)
            const filenames = await fsPromises.readdir(layerPath)
            return filenames
        }))

        const expectedFiles = ['heroesFactory.js', 'heroesRepository.js', 'heroesService.js'] // expected files to be created

        const filenames = files.flat()

        expect(layers).toEqual(['factory', 'repository', 'service'])
        expect(filenames).toEqual(expectedFiles)
    })
})