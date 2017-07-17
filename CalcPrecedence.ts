class CalcPrecedence {
    
    parantheStr: string;
    open: number;
    close: number;
    expression: string;
    valueArray: string[];
    updateValue: number;
    pushStr: string;
    syntaxError: number = 0;
    constructor() {
        //this.expression = "7+12*5/2";
        this.expression = "";
        this.valueArray = [];
        this.updateValue = 0;
        this.pushStr = "";
    }
    calc(str) {
        this.expression = str;

        //split(*) -> 7+12*5/2 as 
        //splitting based on ascii
        // console.log("Splitted String " + this.expression);
        this.valueArray = [];
        let operat: string = "";
        this.pushStr = "";
        //2+3*2/2
        //----------String to array splitter---------- 
        for (let i = 0; i < this.expression.length; i++) {
            if ((this.expression[i].charCodeAt(0) != 46) && (this.expression[i].charCodeAt(0) >= 42 && this.expression[i].charCodeAt(0) <= 47)
                || (this.expression[i].charCodeAt(0) == 37)) {
                if (this.pushStr.length > 0) {
                    this.valueArray.push(this.pushStr);
                    this.pushStr = "";
                }
                operat = this.expression[i];
                this.valueArray.push(operat);
            }
            else {
                this.pushStr = this.pushStr + this.expression[i];
            }
            if (i == this.expression.length - 1) {
                this.valueArray.push(this.pushStr);
            }
        }
        //console.log("Splitted into array " + this.valueArray)
        //-,234 --> -234
        //'-' sign and value needs to be joined
        //3*4+5*6-4+4.75*43+5-32+7-6.444445+12*3-6-0.42857142857+7+12*3+5
        //----------if any negative sign detected it will join with next element--------
        for (let i = 0; i < this.valueArray.length; i++) {
            //first negative sign detect
            if (this.valueArray[0] == '-') {
                let negative = '-';
                negative = negative + this.valueArray[1];
                this.valueArray.splice(0, 2, negative);
                //console.log("First negative detect " + this.valueArray);
            }
            //other negative value concatination
            else if ((this.valueArray[i] == '*' || this.valueArray[i] == '/' || this.valueArray[i] == '+') && (this.valueArray[i + 1] == '-')) {
                let negative = '-';
                negative = negative + this.valueArray[i + 2];
                this.valueArray.splice(i + 1, 2, negative)
                //console.log("Negative Change " + this.valueArray);
            }
            //-,2 -> -2

        }
        //------------Calculation Based on the Precedecnce------------------
        for (let i = 0; i < this.valueArray.length; i++) {
            if (this.valueArray[i] == '/') {
                this.updateValue = parseFloat(this.valueArray[i - 1]) / parseFloat(this.valueArray[i + 1])
                this.valueArray.splice(i - 1, 3, this.updateValue.toString());
            }
        }
        //console.log("Div Processed Value " + this.valueArray)
        for (let i = 0; i < this.valueArray.length; i++) {
            if (this.valueArray[i] == '*') {
                //console.log("Going to process " + this.valueArray[i - 1] + " " + this.valueArray[i + 1])
                this.updateValue = parseFloat(this.valueArray[i - 1]) * parseFloat(this.valueArray[i + 1])
                this.valueArray.splice(i - 1, 3, this.updateValue.toString());
            }
        }
        //console.log("Mul Processed Value " + this.valueArray)

        for (let i = 0; i < this.valueArray.length; i++) {
            if (this.valueArray[i] == '%') {
                this.updateValue = parseFloat(this.valueArray[i - 1]) % parseFloat(this.valueArray[i + 1])
                this.valueArray.splice(i - 1, 3, this.updateValue.toString());
            }
        }
        //console.log("Modul Processed Value " + this.valueArray)

        //console.log("Before Addition and Subtraction " + this.valueArray);
        //---------Seperate subtraction makes program complicate so i kept the 
        //---------negative elements like 3-3 as 3+(-3) and it become add-------
        for (let i = 0; i < this.valueArray.length; i++) {
            if (this.valueArray[i] == '-') {
                if (parseFloat(this.valueArray[i + 1]) > 0) {
                    let negative = '-';
                    negative = negative + this.valueArray[i + 1];
                    this.valueArray.splice(i, 2, '+', negative)
                    //console.log("Negative Change " + this.valueArray);
                }
                else {
                    let negative = -1 * parseFloat(this.valueArray[i + 1]);
                    this.valueArray.splice(i, 2, '+', negative.toString())
                }
            }
        }
        //12+30-4+204.25+5-32+7-6.444444444444445+36-6-0.42857142857142855+7+36+5
        for (let i = 0; i < this.valueArray.length; i++) {
            if (this.valueArray[i] == '+') {
                this.updateValue = parseFloat(this.valueArray[i - 1]) + parseFloat(this.valueArray[i + 1])
                this.valueArray.splice(i - 1, 3, this.updateValue.toString());
            }
            if (this.valueArray[i] == '-') {
                if (parseFloat(this.valueArray[i + 1]) < 0) {
                    //console.log("First " + parseFloat(this.valueArray[i - 1]))
                    //console.log("Second " + parseFloat(this.valueArray[i + 1]))
                    this.updateValue = parseFloat(this.valueArray[i - 1]) + (-1 * (parseFloat(this.valueArray[i + 1])))
                    //console.log("Update value " + this.updateValue)
                    this.valueArray.splice(i - 1, 3, this.updateValue.toString());
                }
            }
        }
        //}
        //console.log("Add and sub Processed Value " + this.valueArray)


        if (this.valueArray.length != 1) {
            //console.log("Still values needs to be processed " + this.valueArray);
            var arraytostring = "";
            for (let i = 0; i < this.valueArray.length; i++) {
                arraytostring = arraytostring + this.valueArray[i];
            }
            //console.log("Converted string " + arraytostring);
            return this.calc(arraytostring);
        }
        var arraytostring = "";
        for (let i = 0; i < this.valueArray.length; i++) {
            arraytostring = arraytostring + this.valueArray[i];
        }
        //console.log("The current processed substring value is " + arraytostring);
        return arraytostring;
    }
    inputExpr(strin: string) {
        //NUll or undefined checker
        if (strin == null || typeof (strin) == "undefined") {
            return "NUll or Undefined Detected";
        }
        //Syntax Checking
        //Regex for first and last element
        let pattern = /^[0-9()]*$/;
        if (!(strin[strin.length - 1].match(pattern))) {
            return "Syntax Error";
        }
        pattern = /^[0-9()-]*$/;
        if (!(strin[0].match(pattern))) {
            return "Syntax Error";
        }
        //Regex for correct syntax
        //pattern = /^[\*+-\/]*$/;
        //-2+(534/639*-(672-98*-326)+-648)+3*2/-2
        for (let i = 0; i < strin.length - 1; i++) {
            if (strin[i] == '+' || strin[i] == '-' || strin[i] == '*' || strin[i] == '/' || strin[i] == '%') {
                if (strin[i + 1] == '-' || strin[i + 1] == '(') {
                    continue;
                }
                if (/^[\*+-\/]*$/.test(strin[i + 1])) {
                    //console.log("Because of "+strin[i]+" At "+ i)
                    return "Syntax Error";
                }
            }
        }
        //-----Now proceeds to calculation on bracketed items-----
        this.parantheStr = strin;
        let count = 0;
        for (let i = 0; i < this.parantheStr.length; i++) {
            if (this.parantheStr[i] == '(') {
                count++;
            }
            if (this.parantheStr[i] == ')') {
                if (count < 1) {
                    count = -1;
                    break;
                }
                count--;
            }
        }
        if (count == 0) {
            //console.log("Balanced Brackets");
            for (let i = 0; i < this.parantheStr.length; i++) {
                if (this.parantheStr[i] == '(') {
                    for (let j = i + 1; j < this.parantheStr.length; j++) {
                        if (this.parantheStr[j] == '(') {
                            i = --j;
                            break;
                        }
                        if (this.parantheStr[j] == ')') {
                            this.open = i;
                            this.close = j;
                            // console.log("Both bracket " + this.open + " " + this.close);
                            this.updateString();
                            i = 0;
                            break;
                        }
                    }
                }
            }
        }
        else {
            //Unbalanced Brackets
            return "Syntax Error";
        }
        if (this.parantheStr.includes('(') && this.parantheStr.includes(')')) {
            this.inputExpr(this.parantheStr);
        }
        //-----When No more Brackets remains send the remaining expression directly 
        //-----or return the result------------------------------------------------
        else {
            //console.log("No more barckets, final call");
            //console.log("The string is " + this.parantheStr);
            var result = this.calc(this.parantheStr);
            //console.log("Result " + result)
            return result;
        }
        return result;
    }
    updateString() {
        let substr = this.parantheStr.substring(this.open + 1, this.close);
        //console.log(substr)
        let returnedValue: string = this.calc(substr);
        //updated inputExpr
        let charArray: string[] = this.parantheStr.split("");
        charArray.splice(this.open, (this.close - this.open) + 1, returnedValue);
        this.parantheStr = "";
        for (let i = 0; i < charArray.length; i++) {
            this.parantheStr = this.parantheStr + charArray[i];
        }
        //console.log("New Simplified string is " + this.parantheStr)
    }
}
/*
var obj = new CalcPrecedence();
//console.log("The Final output is " + obj.inputExpr("639*-31276"));
var inputExpression = "3*4+5*6-32/8+19/4*43+5-32+7-58/9+12*3-48/8-3/7+14/2+12*3+5";
//293.3769841269841
//var inputExpression = "-2+(534/639*-(672-98*-326)+-648)+3*2/-2";
//-27912.906103286383
console.log("The input is " + inputExpression)
console.log("The final output is " + obj.inputExpr(inputExpression));
//1+540/2*5535 -1*/