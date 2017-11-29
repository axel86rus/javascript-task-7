// import { resolve } from "dns";
// import { ftruncateSync } from "fs";

'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (jobs === []) {
            resolve([]);
        }

        let results = [];
        let indexOfJob = 0;
        let queue = jobs.slice(0, parallelNum);
        let jobsIsWait = jobs.slice(parallelNum);
        queue.forEach(job => start(job, indexOfJob++));

        function start(job, indexResult) {
            let finishResult = result => finish(result, indexResult);

            return new Promise((resolveObj, rejectObj) => {
                job().then(resolveObj, rejectObj);
                setTimeout(rejectObj, timeout, new Error('Promise timeout'));
            })
                .then(finishResult)
                .catch(finishResult);
        }

        function finish(result, indexResult) {
            results[indexResult] = result;

            if (!jobsIsWait.length) {
                resolve(results);
            } else if (indexOfJob < jobs.length) {
                start(jobsIsWait.shift(), indexOfJob++);
            }
        }
    });
}
