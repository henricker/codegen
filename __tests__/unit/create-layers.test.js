
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import fs from 'fs';
import fsPromises from 'fs/promises';
import { createLayers } from '../../src/create-layers';

describe('#Layers - create', () => {
    const layers = ['repository', 'service', 'factory']
    const layersDir = 'src'
    const mainPath = './'

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    it('Should not create layers if already exists', async () => {
        const existsSyncSpy = jest.spyOn(fs, fs.existsSync.name).mockReturnValue(true);
        const mkdirSpy = jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue();

        await createLayers({ mainPath, layersDir, layers })

        expect(existsSyncSpy).toHaveBeenCalledTimes(layers.length)
        expect(mkdirSpy).not.toHaveBeenCalled()
    })
    it('Should create layers if not exists', async () => {
        const existsSyncSpy = jest.spyOn(fs, fs.existsSync.name).mockReturnValue(false);
        const mkdirSpy = jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue();

        await createLayers({ mainPath, layersDir, layers })

        expect(existsSyncSpy).toHaveBeenCalledTimes(layers.length);
        expect(mkdirSpy).toHaveBeenCalledTimes(layers.length)
    })
})