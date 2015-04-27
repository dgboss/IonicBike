/**
 * Created by boss on 4/21/2015.
 */

/*angular.module('bikeMapApp.FormServices', [])

    .factory('HazardTypeService',  function(){
        return {
            infrastructure: {
                curb: "Curb",
                island: "Island",
                traintrack: "Train track",
                pothole: "Pothole",
                roadsurface: "Road surface",
                poorsignage: "Poor signage",
                speedlimits: "Speed limits",
                otherinfrastructure: "Other Infrastructure"
            },
            other: {
                poorvisibility: "Poor visibility",
                parkedcar: "Parked car",
                trafficflow: "Traffic flow",
                driverbehaviour: "Driver behaviour",
                cyclistbehavior: "Cyclist behaviour",
                pedestrianbehaviour: "Pedestrian behaviour",
                congestion: "Congestion",
                brokenglass: "Broken glass on road",
                other: "Other (Please describe)"
            }
        }
    })*/

angular.module('bikeMapApp.FormServices', [])

   /* *//* Types of hazards to display on incident form *//*
    .factory('HazardTypeService',  function() {
        return [
            { type: 'Infrastructure', text: 'Curb' },
            { type: 'Infrastructure', text: 'Island' },
            { type: 'Infrastructure', text: 'Train track' },
            { type: 'Infrastructure', text: 'Pothole' },
            { type: 'Infrastructure', text: 'Road surface' },
            { type: 'Infrastructure', text: 'Poor signage' },
            { type: 'Infrastructure', text: 'Speed limits' },
            { type: 'Infrastructure', text: 'Other infrastructure' },
            { type: 'Other', text: 'Poor visibility' },
            { type: 'Other', text: 'Parked car' },
            { type: 'Other', text: 'Traffic flow' },
            { type: 'Other', text: 'Driver behaviour' },
            { type: 'Other', text: 'Cyclist behaviour' },
            { type: 'Other', text: 'Pedestrian behaviour' },
            { type: 'Other', text: 'Congestion' },
            { type: 'Other', text: 'Broken glass on road' },
            { type: 'Other', text: 'Other (please describe' }
        ]
    })*/

    /* Types of hazards to display on incident form */
    .factory('HazardGroupService',  function() {
        return [
            {
                text: 'Infrastructure',
                items: [
                    {text: 'Curb'},
                    {text: 'Island'},
                    {text: 'Train track'},
                    {text: 'Pothole'},
                    {text: 'Road surface'},
                    {text: 'Poor signage'},
                    {text: 'Speed limits'},
                    {text: 'Other infrastructure'}
                ]
            },
            {
                text: "Other",
                items: [
                    {text: 'Poor visibility'},
                    {text: 'Parked car'},
                    {text: 'Traffic flow'},
                    {text: 'Driver behaviour'},
                    {text: 'Cyclist behaviour'},
                    {text: 'Pedestrian behaviour'},
                    {text: 'Congestion'},
                    {text: 'Broken glass on road'},
                    {text: 'Other (please describe'}
                ]
            }]
    })


    /* Range of years to display on incident forms. Min reporting age is 13, display 100 years */
    .factory('BirthYearService', function() {
        var maxYear = new Date().getFullYear() - 13;
        var years = [{ text: '----------' }];

        for(var i = 0; i < 100; i++){
            years.push({ text: (maxYear-i).toString() });
        }
        return years;
    })

    /* Months to display on incident forms */
    .factory('BirthMonthService', function() {
        return [
            { text: '---------' },
            { text: 'January' },
            { text: 'February' },
            { text: 'March' },
            { text: 'April' },
            { text: 'May' },
            { text: 'June' },
            { text: 'July' },
            { text: 'August' },
            { text: 'September' },
            { text: 'October' },
            { text: 'November' },
            { text: 'Decemeber' }
        ]
    })

    /* Genders to display on incident forms */
    .factory('GenderService', function() {
        return [
            { text: '---------' },
            { text: 'Male' },
            { text: 'Female' },
            { text: 'Other' }
        ]
    })

    /* Cycling frequency to display on incident forms */
    .factory('CyclingFrequencyService', function() {
        return [
            { text: '---------' },
            { text: 'Yes' },
            { text: 'No' },
            { text: "I don't know" }
        ]
    });