const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// set defalt value
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to gray
setInicator("#ccc");
// set passwordLength
function handleSlider(){
   inputSlider.value = passwordLength;
   lengthDisplay.innerText = passwordLength;
//    or kuch bhi karna chahiye ?
const minm = inputSlider.min;
const maxm = inputSlider.max;
inputSlider.style.backgroundSize = ((passwordLength - minm)*100/(maxm-minm)) + "% 100%"
                                    //              width                       //   height
}

// set color
function setInicator(color){
   indicator.style.backgroundColor = color;
//    shadow 
   indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRandInteger(min,max){
     return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowercase(){
 
    // getRandInteger(97,123);   but ye number dega 
    // convert in string
    return String.fromCharCode(getRandInteger(97,123));
}

function generateUppercase(){
 
    // getRandInteger(65,91);   but ye number dega 
    // convert in string
    return String.fromCharCode(getRandInteger(65,91));
}


function generateSymols(){
    const randomNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randomNum);
    // charAt function batata hai index par kaun sa character hai
}

function calcStrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >= 8){
        setInicator("#0f0");
    }
    else if((hasLower||hasUpper) &&(hasNum || hasSym) && passwordLength >=6){
        setInicator("#ff0");
    }
    else{
        setInicator("#f00");
    }
}

async function copyContent(){
    try{

        await navigator.clipboard.writeText(passwordDisplay.value);
             copyMsg.innerText = "copied";
    }
    catch(e){
       copyMsg.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
        
    // for sapn invisible use setTimeout
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){

    // fisher yates method
    for(let i = array.length-1; i>0; i--){
        // random j find out using random function
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) =>(str += el));
    return str;
}

function handleCheckBoxChange(){
   checkCount = 0;
   allCheckBox.forEach((checkBox) =>{
    if(checkBox.checked){
        checkCount++; 
    }  
   });
//    special condition 
   if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
   }
}
allCheckBox.forEach((checkBox) =>{
     checkBox.addEventListener('change', handleCheckBoxChange);
})
 inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
 });

 copyBtn.addEventListener('click', () =>{
   if(passwordDisplay.value){
    copyContent();
   }
 } );

 console.log("starting the journey ");

 generateBtn.addEventListener('click', ()=>{
    //   none of checkbox are selected
    if(checkCount == 0)
    {
        
        return ;
    } 

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    console.log("starting the journey ");
    // remove old password

    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase()
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymols);
    }

    // compulsary  addition
    for(let i =0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsary addition done")
    // remaining Addition

    for(let i =0; i<passwordLength-funcArr.length; i++){
         let randIndex = getRandInteger(0,funcArr.length);
         password += funcArr[randIndex]();
    }
    console.log("remaining  addition done")

  
    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffle addition  ")
    
    //  show password in UI
    passwordDisplay.value = password;
    console.log("ui addtion done")

    // calculate strength
    calcStrength();
 });
