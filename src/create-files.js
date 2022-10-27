import { StringReplacer } from './utils/string-replace.js';
import templates from './templates/index.js'
import path from 'path';
import fsPromises from 'fs/promises';

function dependenciesByLayer(layer, componentName) {
    const dependencies = {
        repository: [],
        service: [`${componentName}Repository`],
        factory: [`${componentName}Repository`, `${componentName}Service`]
    }

    return dependencies[layer].map(StringReplacer.firstLetterToLowerCase)
}

function pendingCreateFilesPromise(pendingFiles) {
    return Promise.all(
        pendingFiles.map(
            (file) => fsPromises.writeFile(file.filePath, file.template)
        )
    )
}


export async function createFiles({ mainPath, layersDir, layers, componentName }) {
    const keys = Object.keys(templates)
    const targetPath = path.join(mainPath, layersDir)

    const pendingCreateFiles = []

    for(const layer of layers) {
        const choosenTemplate = keys.find(key => key.includes(layer))
        if(!choosenTemplate) {
            return {
                error: 'Layer doesnt exists'
            }
        }
        const { filename, template } = templates[choosenTemplate](componentName, ...dependenciesByLayer(layer, componentName))
        const filePath = path.join(targetPath, layer, `${filename}.js`)
        pendingCreateFiles.push({ filePath, template })
    }

    await pendingCreateFilesPromise(pendingCreateFiles)

    return { success: true }
}