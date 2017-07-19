import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload/dist/ocLazyLoad';
import calendarState from './components/calendar/module.js';

const ngModule = angular.module('app', [
    'ui.router',
    'oc.lazyLoad'
]);

function config($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider.state('calendar', calendarState);
    ...

    $urlRouterProvider.otherwise('/');
}

ngModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', config]);