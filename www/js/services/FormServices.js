/**
 * Created by boss on 4/21/2015.
 */

angular.module('bikeMapApp.FormServices', [])

    /* Choices for Hazards form */
    .factory('HazardGroupService',  function() {
        return [
            {
                text: 'Infrastructure',
                items: [
                    { key: 'Curb', text: 'Curb' },
                    { key: 'Train track', text: 'Train track' },
                    { key: 'Pothole', text: 'Pothole' },
                    { key: 'Road surface', text: 'Road surface' },
                    { key: 'Poor signage', text: 'Poor signage' },
                    { key: 'Speed limits', text: 'Speed limits' },
                    { key: 'Blind corner', text: 'Blind corner or turn'},
                    { key: 'Bike lane disappears', text: 'Bike lane disappears'},
                    { key: 'Vehicles enter exit', text: 'Vehicles entering/exiting roadway'},
                    { key: 'Dooring risk', text: 'Dooring risk zone'},
                    { key: 'Vehicle in bike lane', text: 'Vehicle use of bike lane'},
                    { key: 'Dangerous intersection', text: 'Dangerous intersection'},
                    { key: 'Dangerous vehicle left turn', text: 'Dangerous vehicle left turn'},
                    { key: 'Dangerous vehicle right turn', text: 'Dangerous vehicle right turn'},
                    { key: 'Sensor does not detect bikes', text: 'Sensor does not pick up bikes'},
                    { key: 'Steep hill', text: 'Steep hill - bike speed affected'},
                    { key: 'Narrow road', text: 'Narrow road'},
                    { key: 'Pedestrian conflict zone', text: 'Pedestrian conflict zone'},
                    { key: 'Other infrastructure', text: 'Other (Please describe)' }
                ]
            },
            {
                text: "Environmental",
                items: [
                    { key: 'Icy/Snowy', text: 'Icy/Snowy' },
                    { key: 'Poor visibility', text: 'Poor visibility' },
                    { key: 'Broken glass', text: 'Broken glass on road' },
                    { key: 'Wet leaves', text: 'Wet leaves on road' },
                    { key: 'Gravel rocks or debris', text: 'Gravel, rocks or debris on road' },
                    { key: 'Construction', text: 'Construction' },
                    { key: 'Other', text: 'Other (Please describe)' }
                ]
            }]
    })


    /* Range of years to display on incident forms. Min reporting age is 13, display 100 years */
    .factory('BirthYearService', function() {
        var maxYear = new Date().getFullYear() - 13;
        var years = [{ text: '----------' }];

        for(var i = 0; i < 100; i++){
            years.push({ key: (maxYear-i).toString(), text: (maxYear-i).toString() });
        }
        return years;
    })

    /* Months to display on incident forms */
    .factory('BirthMonthService', function() {
        return [
            { text: '---------' },
            { key: '1', text: 'January' },
            { key: '2', text: 'February' },
            { key: '3', text: 'March' },
            { key: '4', text: 'April' },
            { key: '5', text: 'May' },
            { key: '6', text: 'June' },
            { key: '7', text: 'July' },
            { key: '8', text: 'August' },
            { key: '9', text: 'September' },
            { key: '10', text: 'October' },
            { key: '11', text: 'November' },
            { key: '12', text: 'December' }
        ]
    })

    /* Genders to display on incident forms */
    .factory('GenderService', function() {
        return [
            { text: '---------' },
            { key: 'M', text: 'Male' },
            { key: 'F', text: 'Female' },
            { key: 'Other', text: 'Other' }
        ]
    })

    /* Cycling frequency to display on incident forms */
    .factory('CyclingFrequencyService', function() {
        return [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ]
    })

    /* Service for Yes/No responses */
    .factory('YesNoService', function() {
        return [
            { text:'---------' },
            { key: true, text: 'Yes' },
            { key: false, text: 'No'}
        ]
    })

    /* Choices for theft form */
    .factory('TheftReportService', function() {
        return {
            theftChoices: [
                { key: 'Bike (value < $1000)', text: 'Bike (value < $1000)' },
                { key: 'Bike (value >= $1000)', text: 'Bike (value >= $1000)' },
                { key: 'Major bike component', text: 'Major bike component (e.g. tire, seat, handlebars, etc.)' },
                { key: 'Minor bike component', text: 'Minor bike component (e.g. lights, topbar padding, bell, etc.)' }
            ],
            lockedChoices: [
                {
                    text: 'Yes',
                    items: [
                        { key: 'Frame locked', text: 'Frame locked' },
                        { key: 'Frame and tire locked', text: 'Frame and tire locked' },
                        { key: 'Frame and both tires locked', text: 'Frame and both tires locked' },
                        { key: 'Tire(s) locked', text: 'Tire(s) locked' }
                    ]
                },
                {
                    text: 'No',
                    items: [
                        { key: 'Not locked', text: 'Not locked' }
                    ]
                }
            ],
            lockTypeChoices: [
                { key: 'U-Lock', text: 'U-Lock' },
                { key: 'Cable lock', text: 'Cable lock' },
                { key: 'U-Lock and cable', text: 'U-Lock and cable' },
                { key: 'Padlock', text: 'Padlock' },
                { key: 'NA', text: 'Not locked' }
            ],
            locationChoices: [
                { key: 'Outdoor bike rack', text: 'At an outdoor bike rack' },
                { key: 'Indoor bike rack', text: 'At an indoor bike rack (e.g. parking garage, bike room)' },
                { key: 'Bike locker', text: 'Inside a bike locker' },
                { key: 'Street sign', text: 'Against street sign' },
                { key: 'Fence/railing', text: 'Against a fence or railing' },
                { key: 'Bench', text: 'Against a public bench' },
                { key: 'Indoors/lobby', text: 'Inside a building/lobby' },
                { key: 'Other', text: 'Other (please describe)' }
            ],
            lightingChoices: [
                { key: 'Good', text: 'Well lit (e.g. bright daylight)' },
                { key: 'Moderate', text: 'Moderately well lit (e.g. streetlights, parking garage)' },
                { key: 'Poor', text: 'Poorly lit (e.g. night, unlit alleyway)' },
                { key: "I don't know", text: "I don't know" }
            ],
            trafficChoices: [
                { key: 'Very High', text: 'Very heavy (pedestrians passing by in a nearly constant stream)' },
                { key: 'High', text: 'Heavy (pedestrians passing by regularly)' },
                { key: 'Medium', text: 'Moderate (irregular pedestrian with busy vehicle traffic)' },
                { key: 'Low', text: 'Light (irregular pedestrian with light to moderate vehicle traffic)' },
                { key: 'Very Low', text: 'Very light (little pedestrian and vehicle traffic)' },
                { key: "I don't know", text: "I don't know" }
            ]
        }
    })

/* Choices for Collision form */
.factory('CollisionReportService', function() {
    return {
        incidentChoices: [
            {
                text: 'Collision',
                items: [
                    { key: 'Collision with stationary object or vehicle', text: 'Collision with a stationary object or vehicle' },
                    { key: 'Collision with moving object or vehicle', text: 'Collision with a moving object or vehicle'}
                ]
            },
            {
                text: 'Fall',
                items: [
                    { key: 'Fall', text: 'Lost control and fell' }
                ]
            }
        ],
        objectChoices: [
            {
                text: 'Vehicle',
                items: [
                    { key: 'Vehicle, head on', text: 'Head on' },
                    { key: 'Vehicle, side', text: 'Side impact' },
                    { key: 'Vehicle, angle', text: 'Angle impact' },
                    { key: 'Vehicle, rear end', text: 'Rear end' },
                    { key: 'Vehicle, open door', text: 'Open vehicle door' }
                ]
            },
            {
                text: 'Person/animal',
                items: [
                    { key: 'Another cyclist', text: 'Another cyclist' },
                    { key: 'Pedestrian', text: 'Pedestrian' },
                    { key: 'Animal', text: 'Animal' }
                ]
            },
            {
                text: 'Infrastructure',
                items: [
                    { key: 'Curb', text: 'Curb' },
                    { key: 'Train Tracks', text: 'Train Tracks' },
                    { key: 'Pothole', text: 'Pothole' },
                    { key: 'Lane divider', text: 'Lane divider' },
                    { key: 'Sign/Post', text: 'Sign/Post' },
                    { key: 'Roadway', text: 'Roadway' }
                ]
            },
            {
                text: 'Other',
                items: [
                    { key: 'Other', text: 'Other (please describe' }
                ]
            }
        ],
        injuredChoices: [
            {
                text: 'Yes',
                items: [
                    { key: 'Injury, no treatment', text: 'Medical treatment not required' },
                    { key: 'Injury, saw family doctor', text: 'Saw a family doctor' },
                    { key: 'Injury, hospital emergency visit', text: 'Visited the hospital emergency dept.' },
                    { key: 'Injury, hospitalized', text: 'Overnight stay in hospital'}
                ]
            },
            {
                text: 'No',
                items: [
                    { key: 'No injury', text: 'No injury' }
                ]
            }
        ],
        impactChoices: [
            { key: "None", text: "No impact" },
            { key: "More careful", text: "I'm now more careful about where/when I ride" },
            { key: "Bike less", text: "I bike less" },
            { key: "More careful and bike less", text: "I'm now more careful about where/when I ride AND I bike less" },
            { key: "Stopped biking", text: "I haven't biked since" },
            { key: "Too soon", text: "Too soon to say" }
        ],
        purposeChoices: [
            { text: '---------'},
            { key: "Commute", text: "To/from work or school" },
            { key: "Exercise or recreation", text: "Exercise or recreation" },
            { key: "Social reason", text: "Social reason (e.g., movies, visit friends)" },
            { key: "Personal business", text: "Personal business" },
            { key: "During work", text: "During work" }
        ],
        conditionChoices: [
            { text: '---------'},
            { key: 'Dry', text: 'Dry' },
            { key: 'Wet', text: 'Wet' },
            { key: 'Loose sand, gravel, or dirt', text: 'Loose sand, gravel, or dirt' },
            { key: 'Icy', text: 'Icy' },
            { key: 'Snowy', text: 'Snowy' },
            { key: "Don't remember", text: "I don't remember" }
        ],
        sightConditionsChoices: [
            { text: '---------'},
            { key: 'No obstructions', text: 'No obstructions' },
            { key: 'View obstructed', text: 'View obstructed' },
            { key: 'Glare or reflection', text: 'Glare or reflection' },
            { key: 'Obstruction on road', text: 'Obstruction on road' },
            { key: "Don't Remember", text: "Don't Remember" }
        ],
        carsParkedChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ],
        ridingOnChoices: [
            {
                text: 'Busy street',
                items: [
                    { key: '', text: '---------' },
                    { key: 'Busy street bike lane', text: 'On a painted bike lane' },
                    { key: 'Busy street, no bike facilities', text: 'On road with no bike facilities' }
                ]
            },
            {
                text: 'Quiet street',
                items: [
                    { key: 'Quiet street bike lane', text: 'On a painted bike lane' },
                    { key: 'Quiet street, no bike facilities', text: 'On road with no bike facilities' }
                ]
            },
            {
                text: 'Not on the street',
                items: [
                    { key: 'Cycle track', text: 'On a physically separated bike lane (cycle track)' },
                    { key: 'Mixed use trail', text: 'On a mixed use trail' },
                    { key: 'Sidewalk', text: 'On the sidewalk' },
                ]
            },
            {
                text: 'Other',
                items: [
                    { key: "Don't remember", text: "I don't remember" }
                ]
            }
        ],
        lightChoices: [
            { text: '---------' },
            { key: "NL", text: "No Lights" },
            { key: "FB", text: "Front and back lights" },
            { key: "F", text: "Front lights only" },
            { key: "B", text: "Back lights only" },
            { key: "Don't remember", text: "I don't remember" }
        ],
        terrainChoices: [
            { text: '--------' },
            { key: 'Uphill', text: 'Uphill' },
            { key: 'Downhill', text: 'Downhill' },
            { key: 'Flat', text: 'Flat' },
            { key: "Don't remember", text: "I don't remember" }
        ],
        directionChoices: [
            { text: '--------' },
            { key: 'N', text: 'N' },
            { key: 'NE', text: 'NE' },
            { key: 'E', text: 'E' },
            { key: 'SE', text: 'SE' },
            { key: 'S', text: 'S' },
            { key: 'SW', text: 'SW' },
            { key: 'W', text: 'W' },
            { key: 'NW', text: 'NW' },
            { key: "I don't know", text: "I don't know" }
        ],
        turningChoices: [
            { text: '--------' },
            { key: 'Heading straight', text: 'Heading straight' },
            { key: 'Turning left', text: 'Turning left' },
            { key: 'Turning right', text: 'Turning right' },
            { key: "I don't remember", text: "I don't remember" }
        ],
        helmetChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ],
        intoxicatedChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ]


    }})

.factory('NearmissReportService', function() {
    return {
        nearmissChoices: [
            {
                text: 'Near miss',
                items: [
                    { key: 'Near collision with stationary object or vehicle', text: 'Near miss with a stationary object or vehicle' },
                    { key: 'Near collision with moving object or vehicle', text: 'Near miss with a moving object or vehicle' }
                ]
            }
        ],
        objectChoices: [
            {
                text: 'Vehicle',
                items: [
                    { key: 'Vehicle, head on', text: 'Head on' },
                    { key: 'Vehicle, side', text: 'Side impact' },
                    { key: 'Vehicle, angle', text: 'Angle impact' },
                    { key: 'Vehicle, rear end', text: 'Rear end' },
                    { key: 'Vehicle, open door', text: 'Open vehicle door' }
                ]
            },
            {
                text: 'Person/animal',
                items: [
                    { key: 'Another cyclist', text: 'Another cyclist' },
                    { key: 'Pedestrian', text: 'Pedestrian' },
                    { key: 'Animal', text: 'Animal' }
                ]
            },
            {
                text: 'Infrastructure',
                items: [
                    { key: 'Curb', text: 'Curb' },
                    { key: 'Train Tracks', text: 'Train Tracks' },
                    { key: 'Pothole', text: 'Pothole' },
                    { key: 'Lane divider', text: 'Lane divider' },
                    { key: 'Sign/Post', text: 'Sign/Post' },
                    { key: 'Roadway', text: 'Roadway' }
                ]
            },
            {
                text: 'Other',
                items: [
                    { key: 'Other', text: 'Other (please describe' }
                ]
            }
        ],
        injuredChoices: [
            {
                text: 'Yes',
                items: [
                    { key: 'Injury, no treatment', text: 'Medical treatment not required' },
                    { key: 'Injury, saw family doctor', text: 'Saw a family doctor' },
                    { key: 'Injury, hospital emergency visit', text: 'Visited the hospital emergency dept.' },
                    { key: 'Injury, hospitalized', text: 'Overnight stay in hospital'}
                ]
            },
            {
                text: 'No',
                items: [
                    { key: 'No injury', text: 'No injury' }
                ]
            }
        ],
        impactChoices: [
            { key: "None", text: "No impact" },
            { key: "More careful", text: "I'm now more careful about where/when I ride" },
            { key: "Bike less", text: "I bike less" },
            { key: "More careful and bike less", text: "I'm now more careful about where/when I ride AND I bike less" },
            { key: "Stopped biking", text: "I haven't biked since" },
            { key: "Too soon", text: "Too soon to say" }
        ],
        purposeChoices: [
            { text: '---------'},
            { key: "Commute", text: "To/from work or school" },
            { key: "Exercise or recreation", text: "Exercise or recreation" },
            { key: "Social reason", text: "Social reason (e.g., movies, visit friends)" },
            { key: "Personal business", text: "Personal business" },
            { key: "During work", text: "During work" }
        ],
        conditionChoices: [
            { text: '---------'},
            { key: 'Dry', text: 'Dry' },
            { key: 'Wet', text: 'Wet' },
            { key: 'Loose sand, gravel, or dirt', text: 'Loose sand, gravel, or dirt' },
            { key: 'Icy', text: 'Icy' },
            { key: 'Snowy', text: 'Snowy' },
            { key: "Don't remember", text: "I don't remember" }
        ],
        sightConditionsChoices: [
            { text: '---------'},
            { key: 'No obstructions', text: 'No obstructions' },
            { key: 'View obstructed', text: 'View obstructed' },
            { key: 'Glare or reflection', text: 'Glare or reflection' },
            { key: 'Obstruction on road', text: 'Obstruction on road' },
            { key: "Don't Remember", text: "Don't Remember" }
        ],
        carsParkedChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ],
        ridingOnChoices: [
            {
                text: 'Busy street',
                items: [
                    { key: '', text: '---------' },
                    { key: 'Busy street bike lane', text: 'On a painted bike lane' },
                    { key: 'Busy street, no bike facilities', text: 'On road with no bike facilities' }
                ]
            },
            {
                text: 'Quiet street',
                items: [
                    { key: 'Quiet street bike lane', text: 'On a painted bike lane' },
                    { key: 'Quiet street, no bike facilities', text: 'On road with no bike facilities' }
                ]
            },
            {
                text: 'Not on the street',
                items: [
                    { key: 'Cycle track', text: 'On a physically separated bike lane (cycle track)' },
                    { key: 'Mixed use trail', text: 'On a mixed use trail' },
                    { key: 'Sidewalk', text: 'On the sidewalk' },
                ]
            },
            {
                text: 'Other',
                items: [
                    { key: "Don't remember", text: "I don't remember" }
                ]
            }
        ],
        lightChoices: [
            { text: '---------' },
            { key: "NL", text: "No Lights" },
            { key: "FB", text: "Front and back lights" },
            { key: "F", text: "Front lights only" },
            { key: "B", text: "Back lights only" },
            { key: "Don't remember", text: "I don't remember" }
        ],
        terrainChoices: [
            { text: '--------' },
            { key: 'Uphill', text: 'Uphill' },
            { key: 'Downhill', text: 'Downhill' },
            { key: 'Flat', text: 'Flat' },
            { key: "Don't remember", text: "I don't remember" }
        ],
        directionChoices: [
            { text: '--------' },
            { key: 'N', text: 'N' },
            { key: 'NE', text: 'NE' },
            { key: 'E', text: 'E' },
            { key: 'SE', text: 'SE' },
            { key: 'S', text: 'S' },
            { key: 'SW', text: 'SW' },
            { key: 'W', text: 'W' },
            { key: 'NW', text: 'NW' },
            { key: "I don't know", text: "I don't know" }
        ],
        turningChoices: [
            { text: '--------' },
            { key: 'Heading straight', text: 'Heading straight' },
            { key: 'Turning left', text: 'Turning left' },
            { key: 'Turning right', text: 'Turning right' },
            { key: "I don't remember", text: "I don't remember" }
        ],
        helmetChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ],
        intoxicatedChoices: [
            { text: '---------' },
            { key: 'Y', text: 'Yes' },
            { key: 'N', text: 'No' },
            { key: "I don't know", text: "I don't know" }
        ]
    }});