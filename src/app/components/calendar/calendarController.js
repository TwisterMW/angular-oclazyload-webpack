let calendarController = function(){
    var vm = this;

    // Declaration
    vm.init = init;

    // Definition
    function init(){

    }

    // Initialization
    vm.init();
}

export default ngModule => {
    ngModule.controller('calendarController', calendarController);
}