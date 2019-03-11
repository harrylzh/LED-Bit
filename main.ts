/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"HelloBot": "file:../pxt-ledbit"
*/

//% color="#ECA40D" weight=20 icon="\uf085"
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
    //% blockId=ledbit_led_draw block="LED expression Draw|X %x|Y %y"
    //% weight=99
    export function LEDDraw(x: number, y: number): void {
        if (!initMatrix) {
            matrixInit();
            initMatrix = true;
        }
        let idx = y * 2 + x / 8;
        let tmp = matBuf[idx + 1];
        tmp |= (1 << (x % 8));
        matBuf[idx + 1] = tmp;
        matrixShow();
    }

    //% blockId=ledbit_led_clear block="LED expression Clear"
    //% weight=98
    //% blockGap=50
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
    //% weight=97
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
