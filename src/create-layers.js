import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

export async function createLayers({ mainPath, layersDir, layers }) {
    const targetDir = path.join(mainPath, layersDir)
    const layersNotExistents = layers.filter(layer => !fs.existsSync(path.join(targetDir, layer)))
    return Promise.all(layersNotExistents.map(layer => fsPromises.mkdir(path.join(targetDir, layer), {
        recursive: true
    })))
}