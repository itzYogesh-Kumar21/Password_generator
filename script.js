const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

const symbols = '~!@#$%^&*():"{}[]?/><,.;|';


// starting me chize
let password = "";
let passwordLength = 10 ;
let checkCount = 0; // pehle se ek checkbox selected hoga
// strength circle ka color starting me greyish h with shadow..
setIndicator("#ccc");
handleSlider();

// set passwordLength

function handleSlider(){
    inputSlider.value = passwordLength ; 
    lengthDisplay.innerText = passwordLength ;
    // or kuch bhi krna h ky
    // slider k piche color hobut aage nhi ho
    const min  = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100 / (max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min , max){
    return Math.floor(Math.random() * (max-min) + min);
}

function generateRandomNumber(){
    return getRndInteger(0 , 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97 , 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65 , 91));
}

function generateSymbol(){      
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower =false;
    let hasSym = false;
    let hasNum = false ;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8 ){
        setIndicator("#0f0")
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        // ye upar wala promise return krega isliye await lagaya function ko aync banaya
        // await means iske completely complete hone k baad move krega
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText  = "Failed.."
    }

    // to make copy wal span visible
    copyMsg.classList.add("active")

    // kuch second k liye hi dikhana h
    setTimeout(()=>{
        copyMsg.classList.remove("active")
    }, 2000)
}

function shufflePassword(array){
    // fisher yates method
    for(let i =( array.length - 1) ; i>0 ; i--){
        // upar piche se aage ki taraf chal rhe h index by index
        // RANDOM J INDEX NIKAL RHE H
        const j = Math.floor(Math.random() * (i+1)); // i+1 is not included , 0 included
        // down step are for swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp ;
    }

    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change' , handleCheckBoxChange )
})

inputSlider.addEventListener( 'input'  ,(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click' , ()=>{
    if(checkCount <= 0 ) return ;

    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider();
    }

    // let start the journey to find new password

    // pehle , pehle wala password hatana padega...
    //remove oldPassword
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase)

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase)

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber)

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol)

    // compulsory addition
    for(let i =0 ; i < funcArr.length ; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0 ; i< passwordLength-funcArr.length ; i++){
        let randIndex = getRndInteger(0 , funcArr.length)
        password += funcArr[randIndex]();
    }

    // shuffle or mix the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password ;

    // strength calculation
    calcStrength();

})

