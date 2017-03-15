"use strict";

import * as command from "commander";

import { CVClient, CVAnalyzeOptions } from "./cv-client";

command
    .arguments('<file>')
    .option('-k, --key <Computer Vision API>', 'The Computer Vision API')
    .option('-v, --visual <Categories,Tags,Description,Faces,ImageType,Color,Adult>', 'Visual features for analysis.')
    .option('-l, --lang <en|zh>', 'Language')
    .action(function(file) {
        var cc = new CVClient(command.key);
        var opt = new CVAnalyzeOptions();

        if (command.lang !== undefined) {
            opt.language = command.lang;
        }

        console.log('Analyzing...');

        cc.analyzeAsync(file, opt).then(function(response){
            console.log(response);
        });
    })
    .parse(process.argv);