let calendarState = {
    url: '/calendar'
    controller: 'calendarController',
    controllerAs: 'vm',
    templateProvider: ['$q', ($q) => {
        return $q((resolve) => {
            require.ensure([], () => {
                var template = require('./calendar-tpl.html');
                
                resolve(template);
            });
        });
    }]
};

export default calendarState;