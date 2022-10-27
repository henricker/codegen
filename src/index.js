import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createLayers } from './create-layers.js'
import { createFiles } from './create-files.js'

let { argv: { component } } = yargs(hideBin(process.argv))
    .command('skeleton', false, (builder) => {
        return builder
            .option('component', {
                type: 'array',
                alias: 'c',
                demandOption: true,
                describe: 'component\'s name'
            })
            .example('skeleton --component-name product', 'creates a project with a single domain')
            .example('skeleton -c product -c person -c colors', 'creates a project with a list of domain')
    })
    .epilog('Henricker dev - 2022')

const env = process.env.NODE_ENV;
const layersDir = env === 'dev' ? 'tmp' : 'src';

const layers = [ 'repository', 'service', 'factory']
const config = { 
    layers,
    layersDir,
    mainPath: '.'
}

await createLayers(config)

const pendingPromises = []

if(!Array.isArray(component)) {
    component = [component]
}

for(const domain of component) {
    const result = createFiles({
        ...config,
        componentName: domain
    })

    pendingPromises.push(result)
}

await Promise.all(pendingPromises)
