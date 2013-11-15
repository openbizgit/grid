// TODO: Grunt: compile almond + app
// TODO: Grunt: hash dependencies? or ETag?

require.config({
    baseUrl: '/assets',
    paths: {
        angular: 'bower_components/angular/angular.min'
        // angular: 'dist/angular.1234.min'
    },
    shim: {
        angular: {exports: 'angular'}
    }
});

require(['angular'], function(angular) {
    var mainScript = document.getElementById('main-script');
    var config = {
        mediaApiUri: mainScript.getAttribute('data-media-api-uri')
    };

    var kahuna = angular.module('kahuna', []);


    // Inject configuration values into the app
    angular.forEach(config, function(value, key) {
        kahuna.constant(key, value);
    });

    kahuna.factory('mediaApi',
                   ['$http', 'mediaApiUri',
                    function($http, mediaApiUri) {

        function search(query, options) {
            options = options || {};

            return $http.get(mediaApiUri + '/images', {
                params: {
                    q:     query || '',
                    since: options.since,
                    size:  20
                }
            }).then(function(response) {
                return response.data.hits;
            });
        }

        function listBuckets() {
            return $http.get(mediaApiUri + '/buckets').then(function(response) {
                return response.data.buckets;
            });
        }

        return {
            search: search,
            listBuckets: listBuckets
        };
    }]);

    kahuna.controller('TestCtrl',
                      ['$scope', 'mediaApi',
                       function($scope, mediaApi) {

        $scope.$watchCollection(function() {
            return {query: $scope.query, since: $scope.since};
        }, function(params) {
            mediaApi.search(params.query, {
                since: params.since
            }).then(function(images) {
                $scope.images = images;
            });
        });

        $scope.since = ''; // default to anytime
        $scope.images = [];


        mediaApi.listBuckets().then(function(buckets) {
            $scope.buckets = buckets;
        });

    }]);

// TODO: router to catch navigation to image
// TODO: show full image + metadata

    angular.bootstrap(document, ['kahuna']);
});