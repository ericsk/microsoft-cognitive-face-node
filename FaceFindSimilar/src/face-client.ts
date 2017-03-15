"use strict";

import * as request from "request";
import * as fs from 'fs';
import * as path from 'path';

class FaceClient {

    private apiKey: string;
    private dir: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Create Face List.
     * 
     * @param faceListName The Face List ID.
     * @returns Face List ID.
     */
    private async createFaceListAsync(faceListName: string, userData: string): Promise<any> {
        console.log("[INFO] Creating face list: %s...", faceListName);
        
        var reqOpt = {
            url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/facelists/' + faceListName,
            json: {
                "name": faceListName,
                "userData": userData
            },
            method: 'PUT',
            headers: {
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };
        return new Promise(function (resolve){
            request(reqOpt, function(error, response, body) {
                resolve();
            });
        });
    }

    private async addFaceIntoFaceList(filename: string, faceListId: string): Promise<any> {

        var absFilePath = path.join(this.dir, filename);
        console.log("[INFO] Adding face %s to face list: %s", absFilePath, faceListId);
        var f = fs.readFileSync(absFilePath);
        var reqOpt = {
            url: "https://westus.api.cognitive.microsoft.com/face/v1.0/facelists/" + faceListId + "/persistedFaces",
            method: "POST",
            body: f,
            headers: {
                'Content-Type': 'application/octet-stream',
                "Ocp-Apim-Subscription-Key": this.apiKey
            }
        };
        return new Promise(function(resolve, reject){
            request(reqOpt, function(error, response, body){
                var obj = JSON.parse(body);
                console.log("[INFO] Face PersistedId: %s", obj.persistedFaceId);
                resolve(obj.persistedFaceId);
            })
        });
    }

    private async detectFaceAsync(filename: string): Promise<any> {
        console.log("[INFO] Detecting the query face: %s", filename);
        var file = fs.readFileSync(filename);
        var reqOpt = {
            url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true',
            method: "POST",
            body: file,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };
        return new Promise(function(resolve, reject){
            request(reqOpt, function(error, response, body){
                var obj = JSON.parse(body);
                console.log("[INFO] Query Face ID: %s", obj[0].faceId);
                resolve(obj[0].faceId);
            });
        });
    }

    async findSimilarAsync(directory: string, filename: string): Promise<any> {
        var faceListId = "facelist-" + new Date().getTime();
        var faceIds = {};
        var self = this;

        this.dir = directory;

        // create face list
        await this.createFaceListAsync(faceListId, "face list sample.");
        
        // list files
        var files = fs.readdirSync(directory);
        // add faces into the facelist
        for (var ind in files) {
            var file = files[ind];
            await self.addFaceIntoFaceList(file, faceListId).then(id => { faceIds[id] = file; });
        }

        var targetId;
        await this.detectFaceAsync(filename).then(faceId => { targetId = faceId});

        console.log("[INFO] Face list: ", faceIds);

        return new Promise(function(resolve, reject){
            var reqOpt = {
                url: "https://westus.api.cognitive.microsoft.com/face/v1.0/findsimilars",
                method: "POST",
                json: {
                    "faceId": targetId,
                    "faceListId": faceListId,
                    "mode": "matchPerson"
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': self.apiKey
                }
            };
            request(reqOpt, function(error, response, body){
                resolve({
                    "confidence": body[0].confidence,
                    "matchFile": faceIds[body[0].persistedFaceId]
                });
            });
        });
    }
}

export { FaceClient };