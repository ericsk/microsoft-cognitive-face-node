"use strict";

import * as command from "commander";

import { FaceClient, FaceDetectionOptions } from "./face-client";

command
    .arguments('<file>')
    .option('-k, --key <Face API key>', 'The Face API key')
    .option('-f, --faceid <true/false>', 'Returns Face ID')
    .option('-l, --facelandmark <true/false>', 'Returns Face Landmark')
    .option('-a, --faceattributes <age,gender,headPose,smile,facialHair,glasses>', 'Request face attributes.')
    .action(function(file) {
        var fc = new FaceClient(command.key);
        var opt = new FaceDetectionOptions();

        if (command.faceid !== undefined) {
            opt.returnFaceId = command.faceid == 'true';
        }

        if (command.facelandmark !== undefined) {
            opt.returnFaceLandmark = command.facelandmark == 'true';
        }

        if (command.faceattributes !== undefined) {
            opt.returnFaceAttributes = command.faceattributes.split(',');
        }

        console.log('Analyzing...');
        fc.detectAsync(file, opt).then(function(response){
            console.log(response);
        });
    })
    .parse(process.argv);