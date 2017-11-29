'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }

        let results = [];
        let indexJob = 0;

        jobs
            .slice(0, parallelNum)
            .forEach(task => {
                start(task, indexJob++);
            });

        function getTranslate(task) {
            return new Promise((resolveTask, rejectTask) => {
                task().then(resolveTask, rejectTask);
                setTimeout(rejectTask, timeout, new Error ('Promise timeout'));
            });
        }
        function start(task, index) {
            let writeResult = result => finish(result, index);

            return getTranslate(task)
                .then(writeResult)
                .catch(writeResult);
        }
        function finish(result, index) {
            results[index] = result;

            if (indexJob === jobs.length) {
                resolve(results);

                return;
            }
            
            start(jobs[indexJob], indexJob++);
        }
    });
}
