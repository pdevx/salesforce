var filebrowseController = angular.module('filebrowse.controller', []);

filebrowseController.controller('filebrowseController', function ($http, $q, $filter, filebrowseService) {
    var vm = {};

    vm.complete = false;

    function sendThatFile() {
        var deferred = $q.defer();
        // var file = vm.file[0].lfFile;
        // var fd = new FormData();
        // fd.append('file', file);
        $http.post('/sendFile', {
            transformRequest: angular.identity,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(function onSuccess(res) {
            deferred.resolve(res);
        }, function onError(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    vm.sendFile = function () {
        vm.complete = false;
        sendThatFile().then(function success(data) {
            console.log(data);
            vm.complete = true;
        }, function error(err) {
            console.log(err);
        });
    };

    return vm;
});
