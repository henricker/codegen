import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';
import { createLayers } from '../create-layers.js'
import { createFiles } from '../create-files.js'

export class CliControllerFluent {
    #component = []

    getData() {
        let { argv: { component } } = yargs(process.argv)
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

        
        if(!Array.isArray(component)) {
            component = [component].filter(Boolean) // remove empty values
        }

        if(component.length === 0) {
            throw new Error('You must inform at least one component')
        }

        this.#component = component
        return this;
    }

    async execute(config) {
        await createLayers(config)

        const pendingPromises = []

        for(const domain of this.#component) {
            const result = createFiles({
                ...config,
                componentName: domain
            })

            pendingPromises.push(result)
        }

        await Promise.all(pendingPromises)
    }
}