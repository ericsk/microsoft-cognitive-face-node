"use strict";

import * as request from "request";
import * as fs from "fs";

class CVAnalyzeOptions {
    visualFeatures: Array<string>;
    details: Array<string>;
    language: string;

    constructor(visualFeatures = ["Categories","Tags"],
                details = [""],
                language = "en") {
        this.visualFeatures = visualFeatures;
        this.details = details;
        this.language = language;
    }
}

class CVClient {

    private apiKey: string;

    ANALYZE_ENDPOINT = "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async analyzeAsync(filename: string, options: CVAnalyzeOptions): Promise<any> {
        var file = fs.readFileSync(filename);
        console.log(this.ANALYZE_ENDPOINT + '?visualFeatures=' + options.visualFeatures.join(',') + '&details=' + options.details + '&language=' + options.language);
        var postOption = {
            url: this.ANALYZE_ENDPOINT + '?visualFeatures=' + options.visualFeatures.join(',') + '&details=' + options.details + '&language=' + options.language,
            body: file,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };

        return new Promise(function(resolve, reject) {
            request(postOption, function(error, response, body) {
                resolve(body);
            });
        });
    }
}

export { CVClient, CVAnalyzeOptions };