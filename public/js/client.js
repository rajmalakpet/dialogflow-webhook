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
    //console.log('gblController initiated');
    $scope.userSearchQuery = "";
    $scope.conversationArr = [];
    $scope.defaultChatMessage = {text:"<div class='row userTypedContainer'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div><img src='./img/chatbot_icon.gif' style='height:40px;width:40px;'></div><div class='botTyped'><span>Hello,<br>I'm a Chatbot and can help you order your food!<br>You can place an order like:<br>\" I'll have Nachos, a Classic Smash with a Coke. \"</span></div></div></div>"};
    $scope.conversationArr.push($scope.defaultChatMessage);
    $scope.botSubmit = function(){
        //console.log('user entered text: ', $scope.userSearchQuery);
        if ($scope.userSearchQuery === ""){
            alert('please order your food from the menu.')
            return
        }
        var _localCopy = $scope.userSearchQuery;
        $scope.conversationArr.push({text:"<div class='row userTypedContainer'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div><span class='badge'>You:</span></div><div class='userTyped'><span>&nbsp;&nbsp;"+_localCopy+"</span></div></div></div>"}); 
        $scope.userSearchQuery = "";

        botAPI.callBOTAPI(_localCopy).then((response) => {
            //console.log('botAPI.callbotapi success result: ', JSON.stringify(response));
            var _botdefaultResponse = typeof(response.data.queryResult.fulfillmentText) !== "undefined" ? response.data.queryResult.fulfillmentText : "";
            $scope.conversationArr.push({text:"<div class='row userTypedContainer'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div><img src='./img/chatbot_icon.gif' style='height:40px;width:40px;'></div><div class='botTyped'><span>"+_botdefaultResponse+"</span></div></div></div>"}); 
            $scope.$emit('animateScroll', '<==== scroll to bottom ====>');
        }, (err) => {
            //console.log('botAPI.callbotapi error: ',err);
            $scope.$emit('animateScroll', '<==== scroll to bottom ====>');
            alert('Session expired. Please refresh the webpage!');
        })
    }

    $scope.$on('animateScroll', function (event, data) {
        //console.log('<==== animateScroll triggered: ' + event + ' : ' + data);
        $("#conversationBox").animate({ scrollTop: $('#conversationBox')[0].scrollHeight });
    });


}]);

app.run(['$rootScope', 'ajax', function($rootScope, ajax){
    //console.log('app.run get the token');
    ajax.callRESTGET().then((response) => {
        //console.log('ajax.callrestget success result: ', JSON.stringify(response));
        $rootScope.access_token = typeof(response.data.token) !== "undefined" ? response.data.token : "";
    }, (err) => {
        alert('Session expired. Please refresh the webpage!');
        //console.log('ajax.callrestget error: ',err);
    });
}])

app.service('ajax', ['$http', function ($http) {
    //console.log('<==== ajax service iniated ====>');
    this.callRESTGET = function () {
        return $http.get('/getToken');
    },
    this.callRESTPOST = function(_url, _data){
        return $http.post(_url, _data);
    }
}]);

app.service('botAPI', ['$http','$rootScope', function ($http, $rootScope) {
    //console.log('<==== botAPI service iniated ====>');
    this.callBOTAPI = function (_keyword) {
        //console.log('<==== botAPI service iniated with: '+$rootScope.access_token);
        if(typeof($rootScope.access_token) === "undefined" || $rootScope.access_token === ""){
            alert('Session expired, please refresh the webpage!');
            return;
        }
        var _data = JSON.stringify({queryParams:{}, query_input:{text:{text:_keyword,language_code:"en-US"}}});
        var _headers = {"Authorization": "Bearer " +$rootScope.access_token};
        return $http.post("https://dialogflow.googleapis.com/v2/projects/takeout-7e4ca/agent/sessions/123456789:detectIntent", _data, {"headers": _headers});
    }
}]);