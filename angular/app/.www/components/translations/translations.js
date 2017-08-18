angular.module("translations", ['pascalprecht.translate']).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en", {
  "FILE_INSTRUCTIONS": "Please choose a file",
  "FILE_RESULTS": "Results can be found in the output folder."
});
}]);
