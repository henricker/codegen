#!/usr/bin/env node

import { CliControllerFluent } from "./cli/cli.js";

try {
    const env = process.env.NODE_ENV;
    const layersDir = env === 'dev' ? 'tmp' : 'src';
    const layers = ['repository', 'service', 'factory']
    const config = { 
        layers,
        layersDir,
        mainPath: '.'
    }

    new CliControllerFluent()
        .getData()
        .execute(config)
} catch(err) {
    console.error(err.message)
}
