const QUESTION_TYPES = [
    "RETURN_TYPE",
    "METHOD_NAME",
    "HOW_MANY_PARAMETERS",
];

const DATA_TYPES = [
    "void",
    "boolean",
    "int",
    "long",
    "byte",
    "char",
    "float",
    "short",
    "double",
    "String",
];

const ACCESS_MODIFIERS = [
    "",
    "public",
    "private",
    "protected",
];

let questionDiv;
let currentQuestionType;
let currentReturnType;
let currentMethodName;
let currentParamCount;

let myp5;
let isCorrect = false;
let isWrong = false;

window.addEventListener('DOMContentLoaded', function(){
    
    document.body.style.fontFamily = "Georgia, serif";
    document.body.style.fontSize = "x-large";

    questionDiv = document.getElementById("questionDivID");
    canvasDiv = document.getElementById("canvasDivID")

    window.addEventListener("keydown", (event) => {
        if(event.key == 'Enter'){
            const txt = document.getElementById("buttonID").innerHTML;
            if(txt == "Click Here to Continue"){
                loadNewQuestion()
            } else {
                checkAnswer();
            }
        }
    });

    loadNewQuestion();

    myp5 = new p5(sketch, window.document.getElementById('canvasDivID'));
});

function generateRandomMethodString(){
    currentReturnType = getRandomEntryFromArray(DATA_TYPES);
    currentMethodName = getRandomEntryFromArray(METHOD_NAMES);
    currentParamCount = Math.floor(Math.random() * 4);
    
    let params = "";
    for(let i = 0; i < currentParamCount; i++){
        params += getRandomEntryFromArray(DATA_TYPES.slice(1)) + " " + getRandomEntryFromArray(PARAM_NAMES);
        if(i < currentParamCount - 1){
            params += ", ";
        }
    }

    let accMod = getRandomEntryFromArray(ACCESS_MODIFIERS);

    let ms = "&nbsp&nbsp" + accMod + " " + currentReturnType + " " + currentMethodName + "(" + params + "){<br>";
    ms += "<br>";
    ms += "&nbsp&nbsp}";
    return ms;
}

function checkAnswer(){
    inpt = document.getElementById("inputID");
    inpt.style.display = "none";    

    let ans = inpt.value;
    let correctAnswer;
    switch(currentQuestionType){
        case "RETURN_TYPE":{
            correctAnswer = currentReturnType;
            break;
        }
        case "METHOD_NAME":{
            correctAnswer = currentMethodName;
            break;
        }
        case "HOW_MANY_PARAMETERS":{
            correctAnswer = currentParamCount;
            break;
        }
    }

    if(ans.trim() == correctAnswer){
        isCorrect = true;

    }else{
        document.body.style.backgroundColor = "#ffa0a0";
        winningStreak = 0;
        isWrong = true;
    }

    questionDiv.innerHTML += "<br><br><br>";
    questionDiv.innerHTML += "Your Answer:<br>";
    questionDiv.innerHTML += ans + "<br><br>";
    questionDiv.innerHTML += "Correct Answer:<br>";
    questionDiv.innerHTML += correctAnswer + "<br>";

    inptBt = document.getElementById("buttonID");
    inptBt.innerHTML = "Click Here to Continue";
    inptBt.onclick = loadNewQuestion;
}

function getRandomEntryFromArray(arr){
    let i = Math.floor(Math.random() * arr.length);
    return arr[i];
}

function createInputBox(){
    let inputBox = document.createElement("input");
    inputBox.id = "inputID";
    inputBox.style.margin = 'auto';
    inputBox.style.display = "block";

    return inputBox;
}

function createInputButton(){
    let inputButton = document.createElement("button");
    inputButton.id = "buttonID";
    inputButton.style.display = "block";
    inputButton.style.margin = 'auto';
    inputButton.innerHTML = "Click Here to Check Your Answer"
    inputButton.onclick = checkAnswer;

    return inputButton;
}

function loadNewQuestion(){
    
    document.body.style.backgroundColor = "#9eaeff";
    currentQuestionType = getRandomEntryFromArray(QUESTION_TYPES);
    
    let qText = "&nbsp&nbsp";

    switch(currentQuestionType){
        case "METHOD_NAME":
            qText += "What is the <strong>name</strong> of the following method?";
            break;
        case "HOW_MANY_PARAMETERS":
            qText += "How many <strong>parameters</strong> does the following method have?<br>"
            qText += "&nbsp&nbsp";
            qText += "(answer in numerical form: 0, 1, 2, etc...)";
            break;
        case "RETURN_TYPE":
        default:
            qText += "What is the <strong>return type</strong> of the following method?";
            break;
    }
    qText += "<br><br><br>" + generateRandomMethodString();

    questionDiv.innerHTML = qText;
    questionDiv.innerHTML += "<br><br><br>"
    questionDiv.appendChild(createInputBox());
    questionDiv.innerHTML += "<br><br><br>"
    questionDiv.appendChild(createInputButton());
}

/*
 *  P5 JS code
 */
let sketch = function (p) {
    
    let p5Canvas;
    let potatoImg, mountainImg;
    let startClimbX, startClimbY;
    let climbX, climbY;
    let targetClimbY;
    let stepYPerCorrectAnswer;
    let climberRotateAmt = 0;
    let winningStreak = 0;
    let numAnswersToWin = 10;

    /*
     * Note: Resizing the background lead to quality loss,
     * so omitting for now
     */
    p.windowResized = function() {
        let newWidth = canvasDiv.offsetWidth;
        let newHeight = canvasDiv.offsetHeight;
        p.resizeCanvas(newWidth, newHeight);

        stepYPerCorrectAnswer = newHeight / numAnswersToWin;
        startClimbX = parseInt((newWidth / 2) - (potatoImg.width / 2));
        startClimbY = parseInt(newHeight - potatoImg.height);
        climbX = startClimbX;
        climbY = startClimbY - (winningStreak * stepYPerCorrectAnswer);
        targetClimbY = climbY;

    }

    p.preload = function() {
        potatoImg = p.loadImage('assets/images/polly-programmer.png');
        mountainImg = p.loadImage('assets/images/mountain.png');
    }

    p.setup = function() {
        p5Canvas = p.createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
        p5Canvas.id('potato')

        stepYPerCorrectAnwser = p5Canvas.height / numAnswersToWin;

        startClimbX = parseInt((p5Canvas.width / 2) - (potatoImg.width / 2));
        startClimbY = parseInt(p5Canvas.height - potatoImg.height);
        climbX = startClimbX;
        climbY = startClimbY;
        targetClimbY = climbY;

        p.background(mountainImg);
        p.loadPixels();

        p.image(potatoImg, climbX, climbY);
    }

    p.draw = function draw() {

        // Preserve background gradient
        p.updatePixels();

        p.textSize(24);
        p.textFont('Helvetica');
        p.fill("#FFA500");
        p.text("streak: " + winningStreak, 10, 30);

        if(winningStreak >= numAnswersToWin){
            alert("You have summited the Mountain of Methods!");
            winningStreak = 0;
        }

        if(isCorrect === true){
            winningStreak += 1;
            targetClimbY = climbY - stepYPerCorrectAnwser;
            isCorrect = false;
        } else if(isWrong) {
            winningStreak = 0;
            targetClimbY = startClimbY;
            isWrong = false;
        }

        if(targetClimbY == climbY) {
            // Still

            climberRotateAmt = 0;
            p.image(potatoImg, climbX, climbY);
        }
        else if(targetClimbY < climbY){
            // Climbing

            if( climbY - targetClimbY < 2){
                climbY = targetClimbY;
            } else {
                climbY -= 2;
            }
            p.image(potatoImg, climbX, climbY);
        }
        else if(targetClimbY > climbY){
            // Falling

            climbY += 1;

            p.push();
            p.translate(climbX + potatoImg.width/2, climbY + potatoImg.height/2);
            p.rotate(climberRotateAmt);
            p.translate(-climbX - potatoImg.width/2, -climbY - potatoImg.height/2);
            p.image(potatoImg, climbX, climbY, potatoImg.width, potatoImg.height);
            p.pop();
        
            climberRotateAmt += 0.1;
        }
    }
}
