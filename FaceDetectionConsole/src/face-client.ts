"use strict";

import * as request from "request";
import * as fs from 'fs';

class FaceDetectionOptions {
    returnFaceId: boolean;
    returnFaceLandmark: boolean;
    returnFaceAttributes: Array<string>;

    constructor(faceid = true, faceLandmark = true, faceAttributes = ["age","gender"]) {
        this.returnFaceId = faceid;
        this.returnFaceLandmark = faceLandmark;
        this.returnFaceAttributes = faceAttributes;
    }
}

class FaceClient {

    // Face API Key
    private apiKey: string;

    DETECT_ENDPOINT = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async detectAsync(filename: string, options: FaceDetectionOptions): Promise<any> {
        var rs = fs.readFileSync(filename);
        var postOption = {
            url: this.DETECT_ENDPOINT + '?returnFaceId=' + options.returnFaceId + '&returnFaceLandmark=' + options.returnFaceLandmark + '&returnFaceAttributes=' + options.returnFaceAttributes.join(','),
            body: rs,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };
        return new Promise( function(resolve, reject) {
            request(postOption, function (error, response, body) {
                resolve(body);
            })
        });
    } 
}

export { FaceClient, FaceDetectionOptions };