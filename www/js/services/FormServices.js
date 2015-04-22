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

    .factory('HazardTypeService',  function() {
        return [

            {text: "Curb"},
            {text: "Island"}
        ]
    })

  /*
                traintrack: "Train track",
                pothole: "Pothole",
                roadsurface: "Road surface",
                poorsignage: "Poor signage",
                speedlimits: "Speed limits",
                otherinfrastructure: "Other Infrastructure",
                poorvisibility: "Poor visibility",
                parkedcar: "Parked car",
                trafficflow: "Traffic flow",
                driverbehaviour: "Driver behaviour",
                cyclistbehavior: "Cyclist behaviour",
                pedestrianbehaviour: "Pedestrian behaviour",
                congestion: "Congestion",
                brokenglass: "Broken glass on road",
                other: "Other (Please describe)"
            }]
    })*/
