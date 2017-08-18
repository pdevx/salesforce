angular.module("translations", ['pascalprecht.translate']).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en", {
  "FILE_INSTRUCTIONS": "Please choose a file"
});
}]);
