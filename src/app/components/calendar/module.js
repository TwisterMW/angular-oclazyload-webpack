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
    }],
    resolve: {
        calendarComponent: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
            return $q((resolve) => {
                require.ensure([], () => {
                    let mod = require('./');
                    $ocLazyLoad.load({ name: mod.default.name });
                    resolve(mod.default);
                });
            });
        }]
    }
};

export default calendarState;