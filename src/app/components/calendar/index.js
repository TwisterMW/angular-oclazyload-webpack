import './calendar.css';
import calendarController from './calendar/calendarController';

const calendarModule = angular.module('calendarModule', []);

calendarController(calendarModule);

export default calendarModule;