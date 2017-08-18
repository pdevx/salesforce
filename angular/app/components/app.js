var angular = require('angular');

var pdevx = angular.module('pdevx', [require('angular-animate'), require('angular-cookies'), require('angular-material'), require('angular-material-icons'), require('angular-messages'), require('angular-storage'), require('angular-translate'), require('angular-ui-router'), 'pdevx.main', 'pdevx.lib', 'pdevx.filebrowse', 'templates', 'translations']);

pdevx.filter('capitalize', function () {
    return function (token) {
        var splitStr = token.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    };
});

pdevx.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

pdevx.config(["$translateProvider", function ($translateProvider) {
    $translateProvider.translations("developer", {});
}]);

pdevx.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
}]);

pdevx.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '400', // by default use shade 400 from the grey palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('blue', {
            'default': '600' // use shade 200 for default, and keep all other shades the same
        });
    $mdThemingProvider.theme('dark', 'default')
        .dark();
    $mdThemingProvider.theme('buttons')
        .primaryPalette('blue', {
            'default': '500'
        })
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('green', {
            'default': '500' // use shade 200 for default, and keep all other shades the same
        })
        .warnPalette('yellow', {
            'default': '500' // use shade 200 for default, and keep all other shades the same
        });
    $mdThemingProvider.theme('colors')
        .primaryPalette('purple', {
            'default': '300'
        })
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('orange', {
            'default': '500' // use shade 200 for default, and keep all other shades the same
        })
        .warnPalette('pink', {
            'default': '500' // use shade 200 for default, and keep all other shades the same
        });
});

pdevx.config(function (storeProvider) {
    // could be localStorage or cookieStorage but we'll user sessionStorage
    storeProvider.setStore('localStorage');
});

pdevx.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            views: {
                'appContent': {
                    templateUrl: 'components/main/main.view.html',
                    controller: 'mainController as vm'
                }
            }
        })

        .state('app.filebrowse', {
            url: '/filebrowse',
            views: {
                'mainContent': {
                    templateUrl: 'components/filebrowse/filebrowse.view.html',
                    controller: 'filebrowseController as vm'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/filebrowse');
});
