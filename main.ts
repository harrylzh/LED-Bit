/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"HelloBot": "file:../pxt-ledbit"
*/

//% color="#E21918" weight=20 icon="\uf140"
namespace LEDBit {

    // HT16K33 commands
    const HT16K33_ADDRESS = 0x70
    const HT16K33_BLINK_CMD = 0x80
    const HT16K33_BLINK_DISPLAYON = 0x01
    const HT16K33_BLINK_OFF = 0
    const HT16K33_BLINK_2HZ = 1
    const HT16K33_BLINK_1HZ = 2
    const HT16K33_BLINK_HALFHZ = 3
    const HT16K33_CMD_BRIGHTNESS = 0xE0

    let matBuf = pins.createBuffer(17);
    let initMatrix = false

    export enum enState { 
         //% blockId="OFF" block="OFF"
         OFF = 0,
         //% blockId="ON" block="ON"
         ON = 1
    }

    //静态表情
    export enum enExpression { 
        //% blockId="FACE1" block="Smile"
        FACE1 = 0,
        //% blockId="FACE2" block="Grin"
        FACE2,
        //% blockId="FACE3" block="Sad"
        FACE3,
        //% blockId="FACE4" block="Cry"
        FACE4,
	//% blockId="FACE5" block="Surprise"
	FACE5,
	//% blockId="FACE5" block="Tongue"
	FACE6,
	//% blockId="FACE5" block="Pout"
	FACE7,
		
    }
    let smile = pins.createBuffer(17);
    let grin = pins.createBuffer(17);
    let sad = pins.createBuffer(17);
    let cry = pins.createBuffer(17);
    let Surprise = pins.createBuffer(17);
    let Tongue = pins.createBuffer(17);  //吐舌头
    let Pout = pins.createBuffer(17);    //咧嘴
	
    let smile1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x10, 0x8, 0x18, 0x18, 0xf, 0xf0, 0x3, 0xc0];
    let grin1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x3f, 0xfc, 0x15, 0xa8, 0xf, 0xf0, 0x3, 0xc0];
    let sad1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x3, 0xc0, 0xf, 0xf0, 0x18, 0x18, 0x30, 0xc, 0x20, 0x4];
    let cry1:number[] = [0x0, 0xc, 0x18, 0xc, 0x18, 0x8, 0x8, 0x0, 0x0, 0x0, 0x0, 0x1, 0xc0, 0x2, 0x20, 0x4, 0x10];
    let Surprise1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x7, 0xe0, 0x4, 0x20, 0x2, 0x40, 0x1, 0x80];
    let Tongue1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x10, 0x8, 0xf, 0xf0, 0xe, 0x0, 0x4, 0x0, 0x0, 0x0];
    let Pout1:number[] = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1f, 0xf8, 0x8, 0x10, 0x4, 0x20, 0x3, 0xc0];

	//数字
	export enum numExpression { 
		//% blockId="num_FACE1" block="num1"
		num_FACE1 = 0,
		//% blockId="num_FACE2" block="num2"
		num_FACE2,
		//% blockId="num_FACE3" block="num3"
		num_FACE3,
		//% blockId="num_FACE4" block="num4"
		num_FACE4,
		//% blockId="num_FACE5" block="num5"
		num_FACE5,
		//% blockId="num_FACE6" block="num6"
		num_FACE6,
		//% blockId="num_FACE7" block="num7"
		num_FACE7,
		//% blockId="num_FACE8" block="num8"
		num_FACE8,
		//% blockId="num_FACE9" block="num9"
		num_FACE9,
		
		
	}
	
	let num1 = pins.createBuffer(17);
	let num2 = pins.createBuffer(17);
	let num3 = pins.createBuffer(17);
	let num4 = pins.createBuffer(17);
	let num5 = pins.createBuffer(17);
	let num6 = pins.createBuffer(17);
	let num7 = pins.createBuffer(17);
	let num8 = pins.createBuffer(17);
	let num9 = pins.createBuffer(17);


	let num11:number[] = [0x0, 0x1, 0x0, 0x1, 0x80, 0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x7, 0xc0];
	let num21:number[] = [0x0, 0x1, 0xc0, 0x2, 0x20, 0x2, 0x0, 0x1, 0x0, 0x0, 0x80, 0x0, 0x40, 0x0, 0x20, 0x3, 0xf0];
	let num31:number[] = [0x0, 0x1,0xc0,0x2,0x20,0x2,0x0,0x1,0x80,0x2,0x0,0x2,0x0,0x2,0x20,0x1,0xc0];
	let num41:number[] = [0x0, 0x0,0x0,0x1,0x40,0x1,0x20,0x1,0x10,0x7,0xf8,0x1,0x0,0x1,0x0,0x1,0x0];
	let num51:number[] = [0x0, 0x7,0xc0,0x0,0x40,0x3,0xc0,0x4,0x0,0x4,0x0,0x4,0x0,0x4,0x40,0x3,0x80];
	let num61:number[] = [0x0, 0x3,0x80,0x0,0x40,0x0,0x20,0x3,0xe0,0x4,0x20,0x4,0x20,0x4,0x20,0x3,0xc0];
	let num71:number[] = [0x0, 0x7,0xe0,0x4,0x0,0x2,0x0,0x1,0x0,0x0,0x80,0x0,0x40,0x0,0x20,0x0,0x0];
	let num81:number[] = [0x0, 0x7,0x80,0x8,0x40,0x8,0x40,0x7,0x80,0x8,0x40,0x8,0x40,0x8,0x40,0x7,0x80];
	let num91:number[] = [0x0, 0x7,0x80,0x8,0x40,0x8,0x40,0x8,0x40,0xf,0x80,0x8,0x0,0x8,0x40,0x7,0x80];
    //动态表情
    export enum dynamicExpression { 
        //% blockId="dynamic_FACE1" block="Open_mouth"
        dynamic_FACE1 = 0,
        //% blockId="dynamic_FACE2" block="Naughty"
        dynamic_FACE2,
		//% blockId="dynamic_FACE2" block="Crying"
        dynamic_FACE3,
    }

    //张大嘴巴
    let Open_mouth0 = pins.createBuffer(17);
    let Open_mouth1 = pins.createBuffer(17);
	 
    let Open_mouth01:number[] = [0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x3,0xc0,0x4,0x20,0x8,0x10,0x4,0x20,0x3,0xc0];
    let Open_mouth11:number[] = [0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x7,0xe0,0xf,0xf0,0x7,0xe0,0x0,0x0];

    //调皮吐舌
    let Naughty0 = pins.createBuffer(17);
    let Naughty1 = pins.createBuffer(17);
	 
    let Naughty01:number[] = [0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0xf,0xf0,0x0,0x0,0x0,0x0,0x0,0x0];
    let Naughty11:number[] = [0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0xf,0xf0,0x3,0xc0,0x1,0x80,0x1,0x80];

	//哇哇大哭
    let Crying0 = pins.createBuffer(17);
    let Crying1 = pins.createBuffer(17);
    let Crying2 = pins.createBuffer(17);
    let Crying3 = pins.createBuffer(17);
    let Crying4 = pins.createBuffer(17);
	
    let Crying01:number[] = [0x0,0x18,0x18,0x18,0x18,0x10,0x8,0x0,0x0,0x0,0x0,0x3,0xc0,0x4,0x20,0x8,0x10];
    let Crying11:number[] = [0x0,0x18,0x18,0x18,0x18,0x10,0x8,0x10,0x8,0x0,0x0,0x3,0xc0,0x4,0x20,0x8,0x10];
    let Crying21:number[] = [0x0,0x18,0x18,0x18,0x18,0x10,0x8,0x10,0x8,0x0,0x0,0x0,0x0,0x7,0xe0,0x8,0x10];
    let Crying31:number[] = [0x0,0x18,0x18,0x18,0x18,0x10,0x8,0x0,0x0,0x10,0x8,0x0,0x0,0x7,0xe0,0x8,0x10];
    let Crying41:number[] = [0x0,0x18,0x18,0x18,0x18,0x10,0x8,0x0,0x0,0x0,0x0,0x10,0x8,0x0,0x0,0xf,0xf0];

    //英文字母
    export enum characterExpression { 
        //% blockId="character_FACE1" block="A"
        character_FACE1 = 0,
        //% blockId="character_FACE2" block="B"
        character_FACE2,
	//% blockId="character_FACE3" block="C"
        character_FACE3,
	//% blockId="character_FACE4" block="D"
        character_FACE4,
	//% blockId="character_FACE5" block="E"
	character_FACE5,
	//% blockId="character_FACE6" block="F"
	character_FACE6,
	//% blockId="character_FACE7" block="G"
	character_FACE7,
	//% blockId="character_FACE8" block="H"
	character_FACE8,
	//% blockId="character_FACE9" block="I"
	character_FACE9,
	//% blockId="character_FACE10" block="J"
	character_FACE10,
	//% blockId="character_FACE11" block="K"
	character_FACE11,
	//% blockId="character_FACE12" block="L"
	character_FACE12,
	//% blockId="character_FACE13" block="M"
	character_FACE13,
	//% blockId="character_FACE14" block="N"
	character_FACE14,
	//% blockId="character_FACE15" block="O"
	character_FACE15,
	//% blockId="character_FACE16" block="P"
	character_FACE16,
	//% blockId="character_FACE17" block="Q"
	character_FACE17,
	//% blockId="character_FACE18" block="R"
	character_FACE18,
	//% blockId="character_FACE19" block="S"
	character_FACE19,
	//% blockId="character_FACE20" block="T"
	character_FACE20,
	//% blockId="character_FACE21" block="U"
	character_FACE21,
	//% blockId="character_FACE22" block="V"
	character_FACE22,
	//% blockId="character_FACE23" block="W"
	character_FACE23,
	//% blockId="character_FACE24" block="X"
	character_FACE24,
	//% blockId="character_FACE25" block="Y"
	character_FACE25,
	//% blockId="character_FACE26" block="Z"
	character_FACE26,
		
    }
	
	let A = pins.createBuffer(17);
    	let B = pins.createBuffer(17);
    	let C = pins.createBuffer(17);
    	let D = pins.createBuffer(17);
	let E = pins.createBuffer(17);
	let F = pins.createBuffer(17);  
    	let G = pins.createBuffer(17); 
	let H = pins.createBuffer(17);
    	let I = pins.createBuffer(17);	
	let J = pins.createBuffer(17);
	let K = pins.createBuffer(17);
	let L = pins.createBuffer(17);
	let M = pins.createBuffer(17);
	let N = pins.createBuffer(17);
	let O = pins.createBuffer(17);
	let P = pins.createBuffer(17);
	let Q = pins.createBuffer(17);
	let R = pins.createBuffer(17);
	let S = pins.createBuffer(17);
	let T = pins.createBuffer(17);
	let U = pins.createBuffer(17);
	let V = pins.createBuffer(17);
	let W = pins.createBuffer(17);
	let X = pins.createBuffer(17);
	let Y = pins.createBuffer(17);
	let Z = pins.createBuffer(17);
	
	let A1:number[] = [0x0, 0x1, 0x0, 0x2, 0x80, 0x4, 0x40, 0x8, 0x20, 0x1f, 0xf0, 0x20, 0x8, 0x40, 0x4, 0x0, 0x0];
    	let B1:number[] = [0x0, 0x1,0xe0,0x2,0x20,0x2,0x20,0x1,0xe0,0x2,0x20,0x2,0x20,0x2,0x20,0x1,0xe0];
    	let C1:number[] = [0x0, 0x1,0xe0,0x2,0x10,0x0,0x10,0x0,0x10,0x0,0x10,0x0,0x10,0x2,0x10,0x1,0xe0];
    	let D1:number[] = [0x0, 0x1,0xf0,0x2,0x10,0x4,0x10,0x4,0x10,0x4,0x10,0x4,0x10,0x2,0x10,0x1,0xe0];
	let E1:number[] = [0x0, 0x1,0xf0,0x0,0x10,0x0,0x10,0x1,0xf0,0x0,0x10,0x0,0x10,0x0,0x10,0x1,0xf0];
    	let F1:number[] = [0x0, 0x7,0xe0,0x0,0x20,0x0,0x20,0x3,0xe0,0x0,0x20,0x0,0x20,0x0,0x20,0x0,0x20];
	let G1:number[] = [0x0, 0x1,0xe0,0x2,0x10,0x0,0x10,0x0,0x10,0x3,0x90,0x2,0x10,0x3,0xe0,0x2,0x0];
	let H1:number[] = [0x0, 0x4,0x20,0x4,0x20,0x4,0x20,0x7,0xe0,0x4,0x20,0x4,0x20,0x4,0x20,0x4,0x20];
	let I1:number[] = [0x0, 0x7,0xc0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x7,0xc0];
    	let J1:number[] = [0x0, 0x7,0xe0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x20,0x0,0xc0,0x0,0x0];
	let K1:number[] = [0x0, 0x4,0x80,0x2,0x80,0x1,0x80,0x1,0x80,0x2,0x80,0x4,0x80,0x8,0x80,0x0,0x0];
	let L1:number[] = [0x0, 0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80,0xf,0x80];
	let M1:number[] = [0x0, 0x20,0x8,0x30,0x18,0x28,0x28,0x24,0x48,0x22,0x88,0x21,0x8,0x20,0x8,0x20,0x8];
	let N1:number[] = [0x0, 0x4,0x8,0x4,0x18,0x4,0x28,0x4,0x48,0x4,0x88,0x5,0x8,0x6,0x8,0x4,0x8];
	let O1:number[] = [0x0, 0x1,0xc0,0x2,0x20,0x4,0x10,0x4,0x10,0x4,0x10,0x4,0x10,0x2,0x20,0x1,0xc0];
	let P1:number[] = [0x0, 0x3,0xe0,0x4,0x20,0x4,0x20,0x4,0x20,0x3,0xe0,0x0,0x20,0x0,0x20,0x0,0x20];
	let Q1:number[] = [0x0, 0x3,0xc0,0x4,0x20,0x4,0x20,0x4,0x20,0x5,0x20,0x6,0x20,0x7,0xc0,0x8,0x0];
	let R1:number[] = [0x0, 0x0,0xe0,0x1,0x20,0x1,0x20,0x1,0x20,0x0,0xe0,0x0,0x60,0x0,0xa0,0x1,0x20];
	let S1:number[] = [0x0, 0x3,0x80,0x4,0x40,0x0,0x40,0x0,0x80,0x1,0x0,0x2,0x0,0x2,0x20,0x1,0xc0];
	let T1:number[] = [0x0, 0xf,0xe0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0,0x1,0x0];
	let U1:number[] = [0x0, 0x4,0x20,0x4,0x20,0x4,0x20,0x4,0x20,0x4,0x20,0x4,0x20,0x3,0xc0,0x0,0x0];
	let V1:number[] = [0x0, 0x0,0x0,0x20,0x8,0x10,0x10,0x8,0x20,0x4,0x40,0x2,0x80,0x1,0x0,0x0,0x0];
	let W1:number[] = [0x0, 0x0,0x0,0x0,0x0,0x41,0x4,0x22,0x88,0x14,0x50,0x8,0x20,0x0,0x0,0x0,0x0];
	let X1:number[] = [0x0, 0x0,0x0,0x8,0x20,0x4,0x40,0x2,0x80,0x1,0x0,0x2,0x80,0x4,0x40,0x8,0x20];
	let Y1:number[] = [0x0, 0x4,0x10,0x2,0x20,0x1,0x40,0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80,0x0,0x80];
	let Z1:number[] = [0x0, 0x1f,0xe0,0x8,0x0,0x4,0x0,0x2,0x0,0x1,0x0,0x0,0x80,0x0,0x40,0x1f,0xe0];
	//静态图案
	export enum pictureExpression { 
		//% blockId="picture_FACE1" block="Big_heart"
		picture_FACE1 = 0,
		//% blockId="picture_FACE2" block="Boat"
		picture_FACE2,
		//% blockId="picture_FACE3" block="Small_heart"
		picture_FACE3,
		//% blockId="picture_FACE4" block="Glass"
		picture_FACE4,
		//% blockId="picture_FACE5" block="Teapot"
		picture_FACE5,
		//% blockId="picture_FACE6" block="House"
		picture_FACE6,
		
	}
	
	let Big_heart = pins.createBuffer(17);
	let Boat = pins.createBuffer(17);
	let Small_heart = pins.createBuffer(17);
	let Glass = pins.createBuffer(17);
	let Teapot = pins.createBuffer(17);
	let House = pins.createBuffer(17);  

	let Big_heart1:number[] = [0x0, 0xc,0x60,0x1e,0xf0,0x1f,0xf0,0x1f,0xf0,0xf,0xe0,0x7,0xc0,0x3,0x80,0x1,0x0];
	let Boat1:number[] = [0x0, 0x8,0x0,0xc,0x0,0xe,0x0,0x8,0x0,0x8,0x0,0x1f,0xf8,0xf,0xf0,0x7,0xe0];
	let Small_heart1:number[] = [0x0, 0x0,0x0,0x6,0xc0,0xf,0xe0,0xf,0xe0,0x7,0xc0,0x3,0x80,0x1,0x0,0x0,0x0];
	let Glass1:number[] = [0x0, 0x0,0x0,0x0,0x0,0xf,0xe0,0x4,0x38,0x4,0x24,0x4,0x24,0x4,0x38,0x7,0xe0];
	let Teapot1:number[] = [0x0, 0x1,0x0,0x3,0x80,0x37,0xc0,0x48,0x2c,0x48,0x38,0x48,0x30,0x34,0x60,0x3,0x80];
	let House1:number[] = [0x0, 0x1,0x0,0x2,0x80,0x4,0x40,0xf,0xe0,0x4,0x40,0x4,0x40,0x4,0x40,0x7,0xc0];
	
	
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function matrixInit() {
        i2ccmd(HT16K33_ADDRESS, 0x21);// turn on oscillator
        i2ccmd(HT16K33_ADDRESS, HT16K33_BLINK_CMD | HT16K33_BLINK_DISPLAYON | (0 << 1));
        i2ccmd(HT16K33_ADDRESS, HT16K33_CMD_BRIGHTNESS | 0xF);
    }

    function matrixShow() {
        matBuf[0] = 0x00;
        pins.i2cWriteBuffer(HT16K33_ADDRESS, matBuf);
    }
    /**
     * *****************************************************************
     * @param index
     */

    //% blockId=ledbit_led_show block="LED expression Show|%index"
    //% weight=99
    export function LEDShow(index: enExpression): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        switch(index) { 
            case enExpression.FACE1: { 
                smile[0] = smile1[0];
                for (let i = 1; i < 17; i += 2) {
                    smile[i] = smile1[i + 1];
                    smile[i + 1] = smile1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, smile);
                break; 
            } 
            case enExpression.FACE2: { 
                //statements; 
                grin[0] = grin1[0];
                for (let i = 1; i < 17; i += 2) {
                    grin[i] = grin1[i + 1];
                    grin[i + 1] = grin1[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, grin);
                break; 
            } 
            case enExpression.FACE3: { 
                sad[0] = sad1[0];
                for (let i = 1; i < 17; i += 2) {
                    sad[i] = sad1[i + 1];
                    sad[i + 1] = sad1[i];
                }
            
                pins.i2cWriteBuffer(HT16K33_ADDRESS, sad);
                break; 
            } 
            case enExpression.FACE4: { 
                cry[0] = cry1[0];
                for (let i = 1; i < 17; i += 2) {
                    cry[i] = cry1[i + 1];
                    cry[i + 1] = cry1[i];
                }
                
                pins.i2cWriteBuffer(HT16K33_ADDRESS, cry);
                break; 
             } 
	     case enExpression.FACE5: { 
                Surprise[0] = Surprise1[0];
                for (let i = 1; i < 17; i += 2) {
                    Surprise[i] = Surprise1[i + 1];
                    Surprise[i + 1] = Surprise1[i];
                }
                
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Surprise);
                break; 
             } 
	     case enExpression.FACE6: { 
                Tongue[0] = Tongue1[0];
                for (let i = 1; i < 17; i += 2) {
                    Tongue[i] = Tongue1[i + 1];
                    Tongue[i + 1] = Tongue1[i];
                }
                
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Tongue);
                break; 
             }
	     case enExpression.FACE7: { 
                Pout[0] = Pout1[0];
                for (let i = 1; i < 17; i += 2) {
                    Pout[i] = Pout1[i + 1];
                    Pout[i + 1] = Pout1[i];
                }
                
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Pout);
                break; 
             }
            default: { 
               //statements; 
               break; 
            } 
         } 
    }
		 
    //% blockId=ledbit_led_dynamic block="LED dynamicexpression Show|%index_1"
    //% weight=98
	export function LEDdynamic(index_1: dynamicExpression): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        switch(index_1) { 
            case dynamicExpression.dynamic_FACE1: { 
                Open_mouth0[0] = Open_mouth01[0];
                for (let i = 1; i < 17; i += 2) {
                    Open_mouth0[i] = Open_mouth01[i + 1];
                    Open_mouth0[i + 1] = Open_mouth01[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, Open_mouth0);
		//control.waitMicros(7000);
		basic.pause(1000);
				
		Open_mouth1[0] = Open_mouth11[0];
                for (let i = 1; i < 17; i += 2) {
                    Open_mouth1[i] = Open_mouth11[i + 1];
                    Open_mouth1[i + 1] = Open_mouth11[i];
                }
   
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Open_mouth1);
		//control.waitMicros(7000);
		basic.pause(1000);
				
                break; 
            } 
            case dynamicExpression.dynamic_FACE2: { 
                //statements; 
                Naughty0[0] = Naughty01[0];
                for (let i = 1; i < 17; i += 2) {
                    Naughty0[i] = Naughty01[i + 1];
                    Naughty0[i + 1] = Naughty01[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Naughty0);
		basic.pause(600);
				
		Naughty1[0] = Naughty11[0];
                for (let i = 1; i < 17; i += 2) {
                    Naughty1[i] = Naughty11[i + 1];
                    Naughty1[i + 1] = Naughty11[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Naughty1);
		basic.pause(600);
				
                break; 
            } 
			
	    case dynamicExpression.dynamic_FACE3: { 
                //statements; 
                Crying0[0] = Crying01[0];
                for (let i = 1; i < 17; i += 2) {
                    Crying0[i] = Crying01[i + 1];
                    Crying0[i + 1] = Crying01[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Crying0);
		basic.pause(600);
				
		Crying1[0] = Crying11[0];
                for (let i = 1; i < 17; i += 2) {
                    Crying1[i] = Crying11[i + 1];
                    Crying1[i + 1] = Crying11[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Crying1);
		basic.pause(600);
				
		Crying2[0] = Crying21[0];
                for (let i = 1; i < 17; i += 2) {
                    Crying2[i] = Crying21[i + 1];
                    Crying2[i + 1] = Crying21[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Crying2);
		basic.pause(600);
			
		Crying3[0] = Crying31[0];
                for (let i = 1; i < 17; i += 2) {
                    Crying3[i] = Crying31[i + 1];
                    Crying3[i + 1] = Crying31[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Crying3);
		basic.pause(600);
			
		Crying4[0] = Crying41[0];
                for (let i = 1; i < 17; i += 2) {
                    Crying4[i] = Crying41[i + 1];
                    Crying4[i + 1] = Crying41[i];
                }
           
                pins.i2cWriteBuffer(HT16K33_ADDRESS, Crying4);
	   	basic.pause(600);
		break; 
	   }
			 
            default: { 
               //statements; 
               break; 
            } 
         } 
    }
    //% blockId=ledbit_led_character block="LED character Show|%index_2"
    //% weight=97
    export function LEDcharacter(index_2: characterExpression): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        switch(index_2) { 
            case characterExpression.character_FACE1: { 
                A[0] = A1[0];
                for (let i = 1; i < 17; i += 2) {
                    A[i] = A1[i + 1];
                    A[i + 1] = A1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, A);
                break; 
            } 
            case characterExpression.character_FACE2: { 
                B[0] = B1[0];
                for (let i = 1; i < 17; i += 2) {
                    B[i] = B1[i + 1];
                    B[i + 1] = B1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, B);
                break; 
            } 
            case characterExpression.character_FACE3: { 
                C[0] = C1[0];
                for (let i = 1; i < 17; i += 2) {
                    C[i] = C1[i + 1];
                    C[i + 1] = C1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, C);
                break; 
            } 
	    case characterExpression.character_FACE4: { 
                D[0] = D1[0];
                for (let i = 1; i < 17; i += 2) {
                    D[i] = D1[i + 1];
                    D[i + 1] = D1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, D);
                break; 
            } 
	    case characterExpression.character_FACE5: { 
                E[0] = E1[0];
                for (let i = 1; i < 17; i += 2) {
                    E[i] = E1[i + 1];
                    E[i + 1] = E1[i];
                }

                pins.i2cWriteBuffer(HT16K33_ADDRESS, E);
                break; 
            } 
	    case characterExpression.character_FACE6: { 
                F[0] = F1[0];
                for (let i = 1; i < 17; i += 2) {
                    F[i] = F1[i + 1];
                    F[i + 1] = F1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, F);
                break; 
            } 
			  
            case characterExpression.character_FACE7: { 
                G[0] = G1[0];
                for (let i = 1; i < 17; i += 2) {
                    G[i] = G1[i + 1];
                    G[i + 1] = G1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, G);
                break; 
            } 
	    case characterExpression.character_FACE8: { 
                H[0] = H1[0];
                for (let i = 1; i < 17; i += 2) {
                    H[i] = H1[i + 1];
                    H[i + 1] = H1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, H);
                break; 
            } 
			
	    case characterExpression.character_FACE9: { 
                I[0] = I1[0];
                for (let i = 1; i < 17; i += 2) {
                    I[i] = I1[i + 1];
                    I[i + 1] = I1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, I);
                break; 
            } 
			 
	    case characterExpression.character_FACE10: { 
                J[0] = J1[0];
                for (let i = 1; i < 17; i += 2) {
                    J[i] = J1[i + 1];
                    J[i + 1] = J1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, J);
                break; 
            } 
	    case characterExpression.character_FACE11: { 
                K[0] = K1[0];
                for (let i = 1; i < 17; i += 2) {
                    K[i] = K1[i + 1];
                    K[i + 1] = K1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, K);
                break; 
            }
	    case characterExpression.character_FACE12: { 
                L[0] = L1[0];
                for (let i = 1; i < 17; i += 2) {
                    L[i] = L1[i + 1];
                    L[i + 1] = L1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, L);
                break; 
            }
	    case characterExpression.character_FACE13: { 
                M[0] = M1[0];
                for (let i = 1; i < 17; i += 2) {
                    M[i] = M1[i + 1];
                    M[i + 1] = M1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, M);
                break; 
            } 
	    case characterExpression.character_FACE14: { 
                N[0] = N1[0];
                for (let i = 1; i < 17; i += 2) {
                    N[i] = N1[i + 1];
                    N[i + 1] = N1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, N);
                break; 
            }
	    case characterExpression.character_FACE15: { 
                O[0] = O1[0];
                for (let i = 1; i < 17; i += 2) {
                    O[i] = O1[i + 1];
                    O[i + 1] = O1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, O);
                break; 
            }
   	    case characterExpression.character_FACE16: { 
                P[0] = P1[0];
                for (let i = 1; i < 17; i += 2) {
                    P[i] = P1[i + 1];
                    P[i + 1] = P1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, P);
                break; 
            }
	    case characterExpression.character_FACE17: { 
                Q[0] = Q1[0];
                for (let i = 1; i < 17; i += 2) {
                    Q[i] = Q1[i + 1];
                    Q[i + 1] = Q1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, Q);
                break; 
            } 
	    case characterExpression.character_FACE18: { 
                R[0] = R1[0];
                for (let i = 1; i < 17; i += 2) {
                    R[i] = R1[i + 1];
                    R[i + 1] = R1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, R);
                break; 
            }
			case characterExpression.character_FACE19: { 
                S[0] = S1[0];
                for (let i = 1; i < 17; i += 2) {
                    S[i] = S1[i + 1];
                    S[i + 1] = S1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, S);
                break; 
            } 
	    case characterExpression.character_FACE20: { 
                T[0] = T1[0];
                for (let i = 1; i < 17; i += 2) {
                    T[i] = T1[i + 1];
                    T[i + 1] = T1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, T);
                break; 
            }
	    case characterExpression.character_FACE21: { 
                U[0] = U1[0];
                for (let i = 1; i < 17; i += 2) {
                    U[i] = U1[i + 1];
                    U[i + 1] = U1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, U);
                break; 
            } 
	    case characterExpression.character_FACE22: { 
                V[0] = V1[0];
                for (let i = 1; i < 17; i += 2) {
                    V[i] = V1[i + 1];
                    V[i + 1] = V1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, V);
                break; 
            }
	    case characterExpression.character_FACE23: { 
                W[0] = W1[0];
                for (let i = 1; i < 17; i += 2) {
                    W[i] = W1[i + 1];
                    W[i + 1] = W1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, W);
                break; 
            } 
	    case characterExpression.character_FACE24: { 
                X[0] = X1[0];
                for (let i = 1; i < 17; i += 2) {
                    X[i] = X1[i + 1];
                    X[i + 1] = X1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, X);
                break; 
            } 
	    case characterExpression.character_FACE25: { 
                Y[0] = Y1[0];
                for (let i = 1; i < 17; i += 2) {
                    Y[i] = Y1[i + 1];
                    Y[i + 1] = Y1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, Y);
                break; 
            }
	    case characterExpression.character_FACE26: { 
                Z[0] = Z1[0];
                for (let i = 1; i < 17; i += 2) {
                    Z[i] = Z1[i + 1];
                    Z[i + 1] = Z1[i];
                }
		pins.i2cWriteBuffer(HT16K33_ADDRESS, Z);
                break; 
            } 			
            default: { 
               //statements; 
               break; 
            } 
         } 
    }
	//% blockId=ledbit_led_num block="LED num Show|%index_3"
	//% weight=96
	export function LEDnum(index_3: numExpression): void {
		if (!initMatrix) {
			matrixInit();
			initMatrix = true;
        }
        switch(index_3) { 
			case numExpression.num_FACE1: { 
				num1[0] = num11[0];
				for (let i = 1; i < 17; i += 2) {
					num1[i] = num11[i + 1];
					num1[i + 1] = num11[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num1);
				break; 
			} 
			case numExpression.num_FACE2: { 
				//statements; 
				num2[0] = num21[0];
				for (let i = 1; i < 17; i += 2) {
					num2[i] = num21[i + 1];
					num2[i + 1] = num21[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num2);
				break; 
			} 

			case numExpression.num_FACE3: { 
				//statements; 
				num3[0] = num31[0];
				for (let i = 1; i < 17; i += 2) {
					num3[i] = num31[i + 1];
					num3[i + 1] = num31[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num3);
				break; 
			} 

			case numExpression.num_FACE4: { 
				//statements; 
				num4[0] = num41[0];
				for (let i = 1; i < 17; i += 2) {
					num4[i] = num41[i + 1];
					num4[i + 1] = num41[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num4);
				break; 
			}
			case numExpression.num_FACE5: { 
				//statements; 
				num5[0] = num51[0];
				for (let i = 1; i < 17; i += 2) {
					num5[i] = num51[i + 1];
					num5[i + 1] = num51[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num5);
				break; 
			} 
			case numExpression.num_FACE6: { 
				//statements; 
				num6[0] = num61[0];
				for (let i = 1; i < 17; i += 2) {
					num6[i] = num61[i + 1];
					num6[i + 1] = num61[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num6);
				break; 
			} 
			case numExpression.num_FACE7: { 
				//statements; 
				num7[0] = num71[0];
				for (let i = 1; i < 17; i += 2) {
					num7[i] = num71[i + 1];
					num7[i + 1] = num71[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num7);
				break; 
			}
			case numExpression.num_FACE8: { 
				//statements; 
				num8[0] = num81[0];
				for (let i = 1; i < 17; i += 2) {
					num8[i] = num81[i + 1];
					num8[i + 1] = num81[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num8);
				break; 
			} 
			case numExpression.num_FACE9: { 
				//statements; 
				num9[0] = num91[0];
				for (let i = 1; i < 17; i += 2) {
					num9[i] = num91[i + 1];
					num9[i + 1] = num91[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, num9);
				break; 
			} 

			default: { 
			   //statements; 
				break; 
			} 
		} 
	}
	
	//% blockId=ledbit_led_picture block="LED picture Show|%index_4"
	//% weight=95
	export function LEDpicture(index_4: pictureExpression): void {
		if (!initMatrix) {
			matrixInit();
			initMatrix = true;
		}
        switch(index_4) { 
			case pictureExpression.picture_FACE1: { 
				Big_heart[0] = Big_heart1[0];
				for (let i = 1; i < 17; i += 2) {
					Big_heart[i] = Big_heart1[i + 1];
					Big_heart[i + 1] = Big_heart1[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, Big_heart);
				break; 
			} 
			case pictureExpression.picture_FACE2: { 
				//statements; 
				Boat[0] = Boat1[0];
				for (let i = 1; i < 17; i += 2) {
					Boat[i] = Boat1[i + 1];
					Boat[i + 1] = Boat1[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, Boat);
				break; 
			} 
			case pictureExpression.picture_FACE3: { 
				Small_heart[0] = Small_heart1[0];
				for (let i = 1; i < 17; i += 2) {
					Small_heart[i] = Small_heart1[i + 1];
					Small_heart[i + 1] = Small_heart1[i];
				}

				pins.i2cWriteBuffer(HT16K33_ADDRESS, Small_heart);
				break; 
			} 
			case pictureExpression.picture_FACE4: { 
				Glass[0] = Glass1[0];
				for (let i = 1; i < 17; i += 2) {
					Glass[i] = Glass1[i + 1];
					Glass[i + 1] = Glass1[i];
				}
				
				pins.i2cWriteBuffer(HT16K33_ADDRESS, Glass);
				break; 
			} 
			 case pictureExpression.picture_FACE5: { 
				Teapot[0] = Teapot1[0];
				for (let i = 1; i < 17; i += 2) {
					Teapot[i] = Teapot1[i + 1];
					Teapot[i + 1] = Teapot1[i];
				}
				
				pins.i2cWriteBuffer(HT16K33_ADDRESS, Teapot);
				break; 
			} 
			 case pictureExpression.picture_FACE6: { 
				House[0] = House1[0];
				for (let i = 1; i < 17; i += 2) {
					House[i] = House1[i + 1];
					House[i + 1] = House1[i];
				}
				
				pins.i2cWriteBuffer(HT16K33_ADDRESS, House);
				break; 
			}

			default: { 
			   //statements; 
				break; 
			} 
		} 
	}
    //% blockId=ledbit_led_draw block="LED expression Draw|X %x|Y %y| %on"
    //% x.min=1 x.max=15 y.min=0 y.max=7
    //% weight=94
    export function LEDDraw(x: number, y: number, on: enState): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        let idx = y * 2 + x / 8;
        let tmp = matBuf[idx + 1];
        if(on == enState.ON)
            tmp |= (1 << (x % 8));
        else
            tmp &= ~(1 << (x % 8));
        matBuf[idx + 1] = tmp;
        matrixShow();
    }


    //% blockId=ledbit_led_clear block="LED expression Clear"
    //% weight=93
    export function LEDClear(): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        for (let i = 0; i < 16; i++) {
            matBuf[i + 1] = 0;
        }
        matrixShow();
    }

    //% blockId=ledbit_led_AllOn block="Matrix All On"
    //% weight=92
    //% blockGap=50
    export function LEDAllOn(): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        for (let i = 0; i < 16; i++) {
            matBuf[i + 1] = 0xff;
        }
        matrixShow();
    }
    
    

}
