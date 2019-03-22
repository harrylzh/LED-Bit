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

    //% blockId=ledbit_led_draw block="LED expression Draw|X %x|Y %y| %on"
    //% x.min=1 x.max=15 y.min=0 y.max=7
    //% weight=97
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
    //% weight=96
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
    //% weight=95
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
