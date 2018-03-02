//VARIABLES:

//HOW MUCH TO ADD TO MISSES, BASED ON THE COUNTER TOGGLE BUTTON
var ballCounter = 1;
//COUNTER FOR THE NUMBER OF BALLS MISSED
var ballTotal = 0;
//COUNTER FOR NUMBER OF GEARS MISSED
var gearTotal = 0;
//VAR FOR KEEPING TRACK OF ANY RADIO BUTTON'S STATUS
var radioChecked;
//AUTON, TELEOP, OR HANGING MODES (1 = AUTON, 2 = TELEOP)
var mode = 1;
//JUST INITIALIZING X, Y, WIDTH, HEIGHT, AND PRE-EVENT TIME VALUES FOR USE LATER
var xVal = 0,
    yVal = 0,
    imgWidth = 0,
    imgHeight = 0,
    timeString = "";

function changeLeft() {
    localStorage.setItem("orientation", 0);
}

function changeRight() {
    localStorage.setItem("orientation", 1);
}

//REFERENCES TO THE LOCALSTORAGE OF PARTICULAR TEAM/MATCH
function SETUP_REF() {
    return String(localStorage.getItem("currentTeam") + localStorage.getItem("currentMatch") + "setupList")
}

function EVENT_REF() {
    return String(localStorage.getItem("currentTeam") + localStorage.getItem("currentMatch") + "eventList")
}

function POST_REF() {
    return String(localStorage.getItem("currentTeam") + localStorage.getItem("currentMatch") + "postList")
}

//PREVENT SCROLLING FROM OCCURING ON ANY SCREEN
$('body').on('touchmove', function (event) {
    event.preventDefault();
});

//POPULATE THE PREMATCH FIELDS WITH DATA IF IT EXISTS
function setupInput() {
    //IF THERE'S SOMETHING SAVED FOR THE CURRENT TEAM AND MATCH NUMBER, POPULATE THE FIELDS WITH THAT DATA
    if (SETUP_REF() !== null) {
        var setupLists = localStorage.getItem(SETUP_REF()).split(",");

        document.getElementById("fullName").value = setupLists[0];
        document.getElementById("matchNum").value = setupLists[1];
        document.getElementById("teamNum").value = setupLists[2];
        document.getElementById("partner1").value = setupLists[3];
        document.getElementById("partner2").value = setupLists[4];
        $("input[value='" + setupLists[6] + "']").prop('checked', true);
    }
}

//CLEAR THE LOCALSTORAGE FOR DEBUG USES
function clearStorage() {
    if (confirm("Do you want to clear all local storage?")) {
        localStorage.clear();
        window.location.replace("index.html");
    }
}

//RESET ALL FIELDS IN PREMATCH
function resetFields() {
    if (confirm("Do you want to reset all fields?")) {
        $("input").val('');
        $("input[type='radio']").removeAttr('checked');
    }
}

//SAVE ALL PREMATCH DATA TO LOCALSTORAGE AND START MATCH
function startGame() {
    mode = 1;
    var SCOUTER_NAME = document.getElementById("fullName").value;
    var MATCH_NUMBER = document.getElementById("matchNum").value;
    var TEAM_NUMBER = document.getElementById("teamNum").value;
    var PARTNER_1 = document.getElementById("partner1").value;
    var PARTNER_2 = document.getElementById("partner2").value;
    var ALLIANCE_COLOR = $("input[name='allColor']:checked").val();

    var setupList = [SCOUTER_NAME,
                     MATCH_NUMBER,
                     TEAM_NUMBER,
                     PARTNER_1,
                     PARTNER_2,
                     getTime(),
                     ALLIANCE_COLOR,
                     localStorage.getItem("orientation")];

    localStorage.setItem("currentMatch", MATCH_NUMBER);
    localStorage.setItem("currentTeam", TEAM_NUMBER);
    localStorage.setItem(SETUP_REF(), setupList);

    window.location.replace("mainSheet.html");
    
    
}

//GET THE TIME IN HH:MM:SS FORMAT
function getTime() {
    var d = new Date();
    return d.toTimeString().split(' ')[0];
}

function switchToAuton() {
    
    mode = 1;
    $('#autonModal').show();
    $('#mainModal').hide();
    $('#hangingModal').hide();
//    if (localStorage.getItem("orientation") == 0)
//        document.getElementById("picture").src = "fieldSheet.svg";
//    else
//        document.getElementById("picture").src = "fieldSheet2.png";
}

//CHANGE THE SCREEN INPUT TO THE HANGING SCREEN IF THE HANGING BUTTON IS CHECKED
function switchToMain() {
    mode = 2;
    $('#autonModal').hide();
    $('#mainModal').show();
    $('#hangingModal').hide();
}


////CHANGE THE SCREEN INPUT TO THE MAIN SCREEN IF THE MAIN BUTTONS ARE CHECKED
//function switchToHanging() {
//    mode = 3;
//    $('#autonModal').hide();
//    $('#mainModal').hide();
//    $('#hangingModal').show();
//}

//GET COORDS OF TOUCH WHEN THE USER TAPS THE FIELD
function point_it(event) {
    var img = new Image();
    img.src = document.getElementById("picture");
    imgWidth = document.getElementById("picture").clientWidth;
    imgHeight = document.getElementById("picture").clientHeight;
    xVal = event.offsetX ? (event.offsetX) : event.pageX - document.getElementById("picture").offsetLeft;
    yVal = event.offsetY ? (event.offsetY) : event.pageY - document.getElementById("picture").offsetTop;
    timeString = getTime();
    var Y_COORD = imgHeight-yVal;
    var X_COORD = Math.round((655 / imgWidth) * xVal);
    var c = document.getElementById("picCanvas");
    c.height = $(window).height();
    c.width = $(window).width();
    var ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(255, 164, 58, 0.78)";
    var cellWidth = document.getElementById("picture").clientWidth / 16;
    var cellHeight = document.getElementById("picture").clientHeight / 8;
//    ctx.moveTo(event.offsetX,event.offsetY);
    ctx.fillRect(document.getElementById("picture").offsetLeft + cellWidth * getXSquare(xVal),        //x-val
                 document.getElementById("picture").offsetTop + cellHeight * getYSquare(yVal),        //y-val
                 cellWidth,     //width
                 cellHeight);   //height
    
//    alert(getXSquare(xVal) + ", " + getYSquare(Y_COORD));
//    alert("hi");
//    setTimeout(function(){
//        c.height = 0;
//        c.width = 0;
//    }, 1000);
//    c.height = 0;
//    c.width = 0;
}
function getXSquare(x) {
    return Math.floor(x/(document.getElementById("picture").clientWidth/16));
}

function getYSquare(x) {
    return Math.floor(x/(document.getElementById("picture").clientHeight/8));
}

//IF THE SAME RADIO BUTTON IS CHECKED AND THEN CLICKED, UNCHECK THAT BUTTON
$("input[type='radio']").click(function () {
    if (radioChecked == this && this.name !== "barOptions") {
        this.checked = false;
        radioChecked = null;
    } else {
        radioChecked = this;
    }
});

//WHEN A USER CLICKS THE CHECK MARK, ADD A NEW EVENT 
function newEvent() {
    var eventList = [];
    var TEMP_EVENT = [];
    var Y_COORD = Math.round(492 - ((492 / imgHeight) * yVal));
    var X_COORD = Math.round((655 / imgWidth) * xVal);

    /*  MODE #'s:
        Switch: 0
        Scale: 1
        Autoline: 2
        Cube: 3
        Exchange: 4
        Climbing: 5
    */

    //MODE: SWITCH
    if (!!$("input[name='switch']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 X_COORD,
                                 Y_COORD,
                                 mode,
                                 0,
                                 $("input[name='autonSwitch']:checked").val(),
                                 null];
    }

    //MODE: SCALE
    if (!!$("input[name='scale']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 X_COORD,
                                 Y_COORD,
                                 mode,
                                 1,
                                 $("input[name='autonScale']:checked").val(),
                                 null];
    }

    //MODE: AUTOLINE
    if (!!$("input[name='autoline']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 X_COORD,
                                 Y_COORD,
                                 mode,
                                 2,
                                 $("input[name='autoline']:checked").val(),
                                 null];
    }

    //MODE: CUBE
    if (!!$("input[name='cube']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 X_COORD,
                                 Y_COORD,
                                 mode,
                                 3,
                                 $("input[name='cube']:checked").val(),
                                 null];
    }

    //MODE: EXCHANGE
    if (!!$("input[name='exchange']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 X_COORD,
                                 Y_COORD,
                                 mode,
                                 4,
                                 $("input[name='exchange']:checked").val(),
                                 null];
    }

    //MODE: CLIMBED
    if (mode == 3) {
        if (document.getElementById("climb").checked) {
            eventList = eventList + [timeString, 
                                     getTime(), 
                                     X_COORD, 
                                     Y_COORD, 
                                     mode, 
                                     5, 
                                     1, 
                                     $("input[name='climbed']:checked").val()];
        } else {
            eventList = eventList + [timeString, 
                                     getTime(), 
                                     X_COORD, 
                                     Y_COORD, 
                                     mode, 
                                     5, 
                                     0, 
                                     null];
        }
    }
    //CHECK IF THERE IS ALREADY DATA FOR THAT MATCH, AND EITHER APPEND OR START THE NEW LOCALSTORAGE
    if (localStorage.getItem(EVENT_REF()) != null) {
        localStorage.setItem(EVENT_REF(), localStorage.getItem(EVENT_REF()) + String(eventList));
    } else {
        localStorage.setItem(EVENT_REF(), String(eventList));
    }

    //RESET ALL FIELDS
    reset();

    //RESETS EVENT LIST
    eventList.length = 0;
}

//RESET ALL FIELDS
function reset() {
    //RESET RADIO BUTTONS, BUT NOT THE MODE BAR AT THE TOP OF THE SCREEN
    $("input[type='radio']").not($("input[name='barOptions']")).removeAttr('checked');

    //RESET SLIDERS
//    document.getElementById("scoreStart").value = 0;
//    document.getElementById("scoreEnd").value = 0;

    //UNCHECK ALL CHECKBOXES
    $("input[type='checkbox']").removeAttr('checked');

    //RESET VARS
//    ballCounter = 1;
//    ballTotal = 0;
//    gearTotal = 0;

    //RESET LABELS WITH DEFAULT VALUES
//    document.getElementById("ballDisplay").textContent = ballTotal;
//    document.getElementById("gearDisplay").textContent = gearTotal;
//    document.getElementById("ballToggle").textContent = ballCounter;
}

//THIS IS A FIX FOR THIS WEIRD BUG WHERE CHECKBOXES WOULD BE DISABLED, BUT CHECKED AT THE SAME TIME
function defenseToggle() {
    if (document.getElementById("defense").checked) {
        document.getElementById("38").disabled = false;
        document.getElementById("39").disabled = false;
        document.getElementById("40").disabled = false;
        document.getElementById("41").disabled = false;
        document.getElementById("42").disabled = false;
        document.getElementById("43").disabled = false;
        document.getElementById("38").checked = false;
        document.getElementById("39").checked = false;
        document.getElementById("40").checked = false;
        document.getElementById("41").checked = false;
        document.getElementById("42").checked = false;
        document.getElementById("43").checked = false;
    } else {
        document.getElementById("38").disabled = true;
        document.getElementById("39").disabled = true;
        document.getElementById("40").disabled = true;
        document.getElementById("41").disabled = true;
        document.getElementById("42").disabled = true;
        document.getElementById("43").disabled = true;
    }
}

//POPULATE THE POSTMATCH FIELDS WITH DATA IF IT EXISTS
function popPost() {

    if (POST_REF() != null) {
        var postLists = localStorage.getItem(POST_REF()).split(",");
        $("input[name=fuelFromFloor][value=" + postLists[0] + "]").attr('checked', 'checked');
        document.getElementById("defense").checked = Boolean(Number(postLists[1]));
        if (Boolean(Number(postLists[1]))) {
            $("input[name=typeOfDefense]").attr("disabled", false);
            $("input[name=locOfDefense]").attr("disabled", false);
            $("input[name=typeOfDefense][value=" + postLists[2] + "]").attr('checked', 'checked');
            $("input[name=locOfDefense][value=" + postLists[3] + "]").attr('checked', 'checked');
        }
        document.getElementById("driver").checked = Boolean(Number(postLists[4]));
        document.getElementById("break").checked = Boolean(Number(postLists[5]));
        document.getElementById("noshow").checked = Boolean(Number(postLists[6]));
    }
}

//SAVE THE POSTGAME DATA TO THE LOCALSTORAGE
function localPost(clickID) {
    var postGame = [
                    (document.getElementById("driver").checked ? 1 : 0),
                    (document.getElementById("break").checked ? 1 : 0),
                    (document.getElementById("noshow").checked ? 1 : 0),
                    ];
    localStorage.setItem(POST_REF(), String(postGame));
    if (clickID == "closePost") {
        window.location.replace("mainSheet.html");
    }
}


//CODE TO GENERATE THE QR CODE
var qrCode = new QRCode(document.getElementById("qrcode"), {
    width: (window.innerHeight * 0.8),
    height: (window.innerHeight * 0.8)
});

function genQr() {
    qrCode.clear();
    localPost();
    alert(localStorage.getItem(POST_REF()));
    qrCode.makeCode(localStorage.getItem(SETUP_REF()) + "," + localStorage.getItem(EVENT_REF()) + "," + localStorage.getItem(POST_REF()));
}