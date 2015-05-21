/**
 * Created by boss on 4/22/2015.
 */

/* Directive to display bootstrap datetimepicker */
bikeMapApp.directive('dgbDatepicker', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            $(element).datetimepicker(scope.$eval(attrs.dgbDatepicker));
        }
    }
});



/* Directive to display a basic form input field as a modal on click */
bikeMapApp.directive('basicSelect',
[
    '$ionicModal',
    function($ionicModal) {
        return {
            /* Only use as <fancy-select> tag */
            restrict : 'E',

            /* Our template */
            templateUrl: 'templates/basic-select.html',

            /* Attributes to set */
            scope: {
                'items'        : '=', /* Items list is mandatory */
                'displayText'  : '=', /* Displayed text is mandatory */
                'selectedItem' : '=',
                'callback'     : '&'
            },

            link: function (scope, element, attrs) {

                /* Header used in ion-header-bar */
                scope.headerText    = attrs.headerText || '';

                /* Text displayed on label */
                // scope.text          = attrs.text || '';
                scope.defaultText   = scope.displayText || '';

                $ionicModal.fromTemplateUrl(
                    'templates/basic-select-items.html',
                    {'scope': scope}
                ).then(function(modal) {
                        scope.modal = modal;
                    });

                /* Show list */
                scope.showItems = function (event) {
                    event.preventDefault();
                    scope.modal.show();
                };

                /* Hide list */
                scope.hideItems = function () {
                    scope.modal.hide();
                };

                /* Destroy modal */
                scope.$on('$destroy', function() {
                    scope.modal.remove();
                });

                /* Handle user selection */
                scope.select = function (item) {

                    // Set selected text
                    //scope.displayText = item.text;
                    scope.selectedItem = item;

                    // Hide items
                    scope.hideItems();

                    // Execute callback function
                    if (typeof scope.callback == 'function') {
                        scope.callback (scope.value);
                    }
                }
            }
        };
    }
]);

/* Directive to display a grouped form input field as a modal on click */
bikeMapApp.directive('groupSelect',
[
    '$ionicModal',
    function($ionicModal) {
        return {
            /* Only use as <fancy-select> tag */
            restrict : 'E',

            /* Our template */
            templateUrl: 'templates/group-select.html',

            /* Attributes to set */
            scope: {
                'groups'       : '=',
                'displayText'  : '=',
                'selectedItem' : '= ',
                'callback'     : '&'
            },

            link: function (scope, element, attrs) {

                /* Header used in ion-header-bar */
                scope.headerText    = attrs.headerText || '';

                /* Text displayed on label */
                // scope.text          = attrs.text || '';
                scope.defaultText   = scope.displayText || '';

                $ionicModal.fromTemplateUrl(
                    'templates/group-select-items.html',
                    {'scope': scope}
                ).then(function(modal) {
                        scope.modal = modal;
                    });

                /* Show list */
                scope.showItems = function (event) {
                    event.preventDefault();
                    scope.modal.show();
                };

                /* Hide list */
                scope.hideItems = function () {
                    scope.modal.hide();
                };

                /* Destroy modal */
                scope.$on('$destroy', function() {
                    scope.modal.remove();
                });

                /* Handle user selection */
                scope.select = function (item) {

                    // Set selected text
                    // scope.displayText = item.text;
                    scope.selectedItem = item

                    // Hide items
                    scope.hideItems();

                    // Execute callback function
                    if (typeof scope.callback == 'function') {
                        scope.callback (scope.value);
                    }
                }
            }
        };
    }
]);
