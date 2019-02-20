var app = angular.module('chatbot', ['ui.bootstrap']);
app.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]);

app.controller('gblController', ['$scope', 'botAPI', function($scope, botAPI){
    console.log('gblController initiated');
    $scope.userSearchQuery = "";
    $scope.conversationArr = [];
    $scope.botSubmit = function(){
        console.log('user entered text: ', $scope.userSearchQuery);
        if ($scope.userSearchQuery === ""){
            alert('please order your food from the menu.')
            return
        }
        var _localCopy = $scope.userSearchQuery;
        $scope.conversationArr.push({text:"<div style='color:green'>"+_localCopy+"</div>"}); 
        $scope.userSearchQuery = "";

        botAPI.callBOTAPI(_localCopy).then((response) => {
            console.log('botAPI.callbotapi success result: ', JSON.stringify(response));
            var _botdefaultResponse = typeof(response.data.queryResult.fulfillmentText) !== "undefined" ? response.data.queryResult.fulfillmentText : "";
            $scope.conversationArr.push({text:"<div style='color:red'>"+_botdefaultResponse+"</div>"}); 
        }, (err) => {
            console.log('botAPI.callbotapi error: ',err);
        })
    }
}]);

app.run(['$rootScope', 'ajax', function($rootScope, ajax){
    console.log('app.run get the token');
    ajax.callRESTGET().then((response) => {
        console.log('ajax.callrestget success result: ', JSON.stringify(response));
        $rootScope.access_token = typeof(response.data.token) !== "undefined" ? response.data.token : "";
    }, (err) => {
        console.log('ajax.callrestget error: ',err);
    });
}])

app.service('ajax', ['$http', function ($http) {
    console.log('<==== ajax service iniated ====>');
    this.callRESTGET = function () {
        return $http.get('/getToken');
    },
    this.callRESTPOST = function(_url, _data){
        return $http.post(_url, _data);
    }
}]);

app.service('botAPI', ['$http','$rootScope', function ($http, $rootScope) {
    console.log('<==== botAPI service iniated ====>');
    this.callBOTAPI = function (_keyword) {
        console.log('<==== botAPI service iniated with: '+$rootScope.access_token);
        if(typeof($rootScope.access_token) === "undefined" || $rootScope.access_token === ""){
            alert('fatal error - no token found!');
            return;
        }
        var _data = JSON.stringify({queryParams:{}, query_input:{text:{text:_keyword,language_code:"en-US"}},outputAudioConfig:{},inputAudio:""});
        var _headers = {"Authorization": "Bearer " +$rootScope.access_token};
        return $http.post("https://dialogflow.googleapis.com/v2/projects/takeout-7e4ca/agent/sessions/123456789:detectIntent", _data, {"headers": _headers});
    }
}]);