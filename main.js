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

//session orientation. 0=red is left, 1=red is right
var orient = 0;

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
    updateRadios();
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

//x1/y1 is top left, x2/y2 is bottom right, x3/y3 is position to check
function checkInRange(x1, y1, x2, y2, x3, y3) {
    return (x3 >= x1 && x3 <= x2) && (y3 >= y1 && y3 <= y2);
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
                     localStorage.getItem("orientation"),
                     $("input[name='fieldStartPos']:checked").val()];

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
    $('#autonModal').hide();
    $('#mainModal').show();
    $('#hangingModal').hide();
    var c = document.getElementById("picCanvas");
    c.height = 0;
    c.width = 0;
    document.getElementById("picture").src = "fieldSheet.svg";
    if (localStorage.getItem("orientation") == 0){
        $("#picture").css({'transform': 'rotate(0deg)'});
    } else {
        $("#picture").css({'transform': 'rotate(180deg)'});
    }
    orient = localStorage.getItem("orientation");
//        document.getElementById("picture").src = "fieldSheet2.png";
}

//CHANGE THE SCREEN INPUT TO THE HANGING SCREEN IF THE HANGING BUTTON IS CHECKED
function switchToMain() {
    mode = 2;
    $('#autonModal').hide();
    $('#mainModal').show();
    $('#hangingModal').hide();
}


//CHANGE THE SCREEN INPUT TO THE MAIN SCREEN IF THE MAIN BUTTONS ARE CHECKED
function switchToHanging() {
    mode = 3;
    $('#autonModal').hide();
    $('#mainModal').hide();
    $('#hangingModal').show();
}

//GET COORDS OF TOUCH WHEN THE USER TAPS THE FIELD
function point_it(event) {
    $("#mainTable tr").remove();
    $('#mainTable > tbody:last-child').append('<tr><td><p class="title">CUBE</p><div class="buttonCheckboxes"><input type="radio" id="7" value="1" type="radio" name="cube"><label class="left" style="width: 130px;" for="7">Picked Up</label>  <input type="radio" id="8" value="0" type="radio" name="cube"><label class="right" for="8">Dropped</label></div><br></td></tr>');
    
    
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
//    alert(orient);
    if (orient == 1) {
        xVal = imgWidth-xVal;
        yVal = imgHeight-yVal;
    }
        
    ctx.fillRect(document.getElementById("picture").offsetLeft + cellWidth * getXSquare(xVal),        //x-val
                 document.getElementById("picture").offsetTop + cellHeight * getYSquare(yVal),        //y-val
                 cellWidth,     //width
                 cellHeight);   //height
//    alert(checkInRange(2,1,5,6,getXSquare(xVal),getYSquare(yVal)));
//    alert(getXSquare(xVal) + ", " + getYSquare(Y_COORD));
//    alert("hi");
    //autoline
    if ((checkInRange(0,0,2,7,getXSquare(xVal),getYSquare(yVal)) || checkInRange(13,0,15,7,getXSquare(xVal),getYSquare(yVal))) && mode == 1) {
        $('#mainTable tr:last').after('<tr> <td> <p class="title">AUTOLINE CROSSED</p> <div class="buttonCheckboxes"> <input type="radio" id="5" value="1" type="radio" name="autoline"> <label class="left" for="5">Yes</label> <input type="radio" id="6" value="0" type="radio" name="autoline"> <label class="right" for="6">No</label> </div><br> </td> </tr>');
    }
    
    //exchange
    if (checkInRange(0,2,1,3,getXSquare(xVal),getYSquare(yVal)) || checkInRange(14,4,15,5,getXSquare(xVal),getYSquare(yVal))) {
        $('#mainTable tr:last').after('<tr> <td> <p class="title">EXCHANGE</p> <div class="buttonCheckboxes"> <input type="radio" id="21" value="1" type="radio" name="exchange"> <label class="left" for="21">Scored</label> <input type="radio" id="22" value="0" type="radio" name="exchange"> <label class="right" for="22" style="width: 130px">Attempted</label> </div><br> </td> </tr>');
    }
    
    //switch
    if (checkInRange(2,1,5,6,getXSquare(xVal),getYSquare(yVal)) || checkInRange(10,1,13,6,getXSquare(xVal),getYSquare(yVal))) {
        $('#mainTable tr:last').after('<tr> <td> <p class="title">SWITCH</p> <div class="buttonCheckboxes"> <input type="radio" id="1" value="1" type="radio" name="switch"> <label class="left" for="1">Scored</label> <input type="radio" id="2" value="0" type="radio" name="switch"> <label class="right" for="2">Missed</label> </div><br> </td> </tr>');
    }
    
    //scale
    if (checkInRange(7,0,8,7,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,1,9,2,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,5,9,6,getXSquare(xVal),getYSquare(yVal))) {
        $('#mainTable tr:last').after('<tr> <td> <p class="title">SCALE</p> <div class="buttonCheckboxes"> <input type="radio" id="3" value="3" type="radio" name="scale"> <label class="left" for="3">High</label> <input type="radio" id="4" value="2" type="radio" name="scale"> <label for="4">Neutral</label> <input type="radio" id="81" value="1" type="radio" name="scale"> <label for="81">Low</label> <input type="radio" id="80" value="0" type="radio" name="scale"> <label class="right" for="80">Missed</label></div><br> </td> </tr>');
    }
    
    //climbing
    if (checkInRange(7,3,8,4,getXSquare(xVal),getYSquare(yVal)) && mode == 2) {
        $('#mainTable tr:last').after('<tr><td> <p class="title">CLIMBED</p> <table> <td style="width: 50%"> <div style="margin-top: 27px" class="switch"> <input id="climb" onclick="climbingCheck()" class="cmn-toggle cmn-toggle-round-flat" type="checkbox"> <label for="climb"></label> </div> </td> <td> <p style="float: left">Attempted</p> </td> </table><br> <div class="buttonCheckboxes"> <input type="radio" id="11" value="1" type="radio" name="climbed" disabled> <label class="left" for="11">Success</label> <input type="radio" id="12" value="0" type="radio" name="climbed" disabled> <label class="right" for="12">Failed</label> </div><br><br></td></tr>');
    }
    updateRadios();
//    //platform
//    if (checkInRange(6,2,9,5,getXSquare(xVal),getYSquare(yVal)) && mode == 2) {
//        $('#mainTable tr:last').after('<tr> <td> <p class="title">PLATFORM</p> <div class="buttonCheckboxes"> <input type="radio" id="30" value="0" type="radio" name="platform"> <label class="left" for="30">Yes</label> <input type="radio" id="31" value="1" type="radio" name="platform"> <label class="right" for="31">No</label> </div><br> </td> </tr>');
//    }
}
function getXSquare(x) {
    return Math.floor(x/(document.getElementById("picture").clientWidth/16));
}

function getYSquare(x) {
    return Math.floor(x/(document.getElementById("picture").clientHeight/8));
}

//function locationSquare(x,y) {
//    if 
//}

//IF THE SAME RADIO BUTTON IS CHECKED AND THEN CLICKED, UNCHECK THAT BUTTON
function updateRadios() {
    $("input[type='radio']").click(function () {
        if (radioChecked == this && this.name !== "barOptions") {
            this.checked = false;
            radioChecked = null;
        } else {
            radioChecked = this;
        }
    });
}

function climbingCheck() {
    if ($("#climb").prop("checked")) {
        $("input[name='climbed']").attr('disabled', false);
    } else {
        $("input[name='climbed']").attr('disabled', true);
        $("input[name='climbed']").attr('checked', false);
    }
}

//WHEN A USER CLICKS THE CHECK MARK, ADD A NEW EVENT 
function newEvent() {
    var eventList = [];
    var TEMP_EVENT = [];
    var Y_COORD = Math.round(492 - ((492 / imgHeight) * yVal));
    var X_COORD = Math.round((655 / imgWidth) * xVal);
//    if (!!$("input[name='switch']:checked").val())
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
                                 getXSquare(xVal),
                                 getYSquare(yVal),
                                 mode,
                                 0,
                                 $("input[name='switch']:checked").val()];
    }

    //MODE: SCALE
    if (!!$("input[name='scale']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 getXSquare(xVal),
                                 getYSquare(yVal),
                                 mode,
                                 1,
                                 $("input[name='scale']:checked").val()];
    }

    //MODE: AUTOLINE
    if (!!$("input[name='autoline']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 getXSquare(xVal),
                                 getYSquare(yVal),
                                 mode,
                                 2,
                                 $("input[name='autoline']:checked").val()];
    }

    //MODE: CUBE
    if (!!$("input[name='cube']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 getXSquare(xVal),
                                 getYSquare(yVal),
                                 mode,
                                 3,
                                 $("input[name='cube']:checked").val()];
    }

    //MODE: EXCHANGE
    if (!!$("input[name='exchange']:checked").val()) {
        eventList = eventList + [timeString,
                                 getTime(),
                                 getXSquare(xVal),
                                 getYSquare(yVal),
                                 mode,
                                 4,
                                 $("input[name='exchange']:checked").val()];
    }

//    //MODE: CLIMBED
//    if (document.getElementById("climb").checked) {
//        eventList = eventList + [timeString, 
//                                 getTime(), 
//                                 getXSquare(xVal), 
//                                 getYSquare(yVal), 
//                                 mode, 
//                                 5, 
//                                 null];
//    } else {
//        eventList = eventList + [timeString, 
//                                 getTime(), 
//                                 getXSquare(xVal), 
//                                 getYSquare(yVal), 
//                                 mode, 
//                                 5,
//                                 null];
//    }
//    
    if (checkInRange(0,2,1,3,getXSquare(xVal),getYSquare(yVal)) || checkInRange(14,4,15,5,getXSquare(xVal),getYSquare(yVal))) {
        eventList[eventList.length-1][7] = 0;
    } else if (checkInRange(2,1,5,6,getXSquare(xVal),getYSquare(yVal)) || checkInRange(10,1,13,6,getXSquare(xVal),getYSquare(yVal))) {
        eventList[eventList.length-1][7] = 1;
    } else if (checkInRange(7,0,8,7,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,1,9,2,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,5,9,6,getXSquare(xVal),getYSquare(yVal))) {
        eventList[eventList.length-1][7] = 2;
    } else if (checkInRange(6,2,9,5,getXSquare(xVal),getYSquare(yVal))) {
        eventList[eventList.length-1][7] = 3;
    } else if (checkInRange(6,2,9,5,getXSquare(xVal),getYSquare(yVal)) && (checkInRange(7,0,8,7,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,1,9,2,getXSquare(xVal),getYSquare(yVal)) || checkInRange(6,5,9,6,getXSquare(xVal),getYSquare(yVal)))) {
        eventList[eventList.length-1][7] = 4;
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
                    (document.getElementById("defense").checked ? 1 : 0),
                    (document.getElementById("levitate").checked ? 1 : 0),
                    (document.getElementById("driver").checked ? 1 : 0),
                    (document.getElementById("break").checked ? 1 : 0),
                    (document.getElementById("noshow").checked ? 1 : 0),
                    $("input[name='cube']:checked").val()];
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