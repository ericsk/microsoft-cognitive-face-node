"use strict";

import * as command from 'commander';
import * as path from 'path';
import { FaceClient } from './face-client';

command
    .usage('[options] <directory> <file>')
    .option('-k, --key <key>', 'The Face API Key.')
    .action(function(directory, file, options){
        var fc = new FaceClient(command.key);

        fc.findSimilarAsync(directory, file).then(function(ret){
            console.log("Result: %s and %s is similar. Confidence: %s", 
                file,
                path.join(directory, ret.matchFile),
                ret.confidence);
        });
    })
    .parse(process.argv);