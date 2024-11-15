/*
*	
*/
//% color=#0fbc11 icon="\uf1ab" block="rgblcd"
namespace rgblcd {

    let isnotinitialized = true

    //every line gets its own buffer
    let row0 = ""
    let row1 = ""

    //every line gets its own speed
    let row0Speed = 0
    let row1Speed = 0

    //prevents the flooding of the lcd
    //only write new text 
    let row0Written = true
    let row1Written = true

    //a poormans semaphore
    let lcdUsed = false

    //syncronous writing of row0
    //if the string in row0 is greater than 16 characters(the display with) the screen is scrolled
    //if row0 is lower than 16 the screen will be written only with the new incoming string

    control.inBackground(() => {
        let pos0 = 0
        init()
        while (true) {
            while (lcdUsed) {
            }
            basic.pause(1)
            lcdUsed = true
            if (row0.length > 16) {
                if (pos0 == 1) {
                    basic.pause(1000)
                }
                setCursor(0, 0)
                writeLCD(row0.substr(pos0, 16))
                basic.pause(row0Speed)
                pos0 += 1
                if (pos0 == (row0.length - 15)) {
                    pos0 = 0
                    basic.pause(1000)
                }
            } else {
                if (row0Written) {
                    clearrow0()
                    setCursor(0, 0)
                    writeLCD(row0)
                    row0Written = false
                }
            }
            lcdUsed = false

        }
    })

    control.inBackground(() => {
        let pos1 = 0
        init()
        while (true) {
            while (lcdUsed) {
            }
            basic.pause(1)
            lcdUsed = true
            if (row1.length > 16) {
                if (pos1 == 1) {
                    basic.pause(1000)
                }
                setCursor(0, 1)
                writeLCD(row1.substr(pos1, 16))
                basic.pause(row1Speed)
                pos1 += 1
                if (pos1 == (row1.length - 15)) {
                    pos1 = 0
                    basic.pause(1000)
                }
            } else {
                if (row1Written) {
                    clearrow1()
                    setCursor(0, 1)
                    writeLCD(row1)
                    row1Written = false
                }
            }
            lcdUsed = false

        }
    })

    function writeLCD(str: string) {
        let buf = pins.createBuffer(str.length + 1)
        buf[0] = 0x40
        for (let index = 1; index <= str.length; index++) {
            buf[index] = str.charCodeAt(index - 1)
        }
        pins.i2cWriteBuffer(0x3E, buf)
    }

    /**
     * prints a string on the LCD display
     * @param str text to display
     * @param row row to be written to
     * @param speed speed of the scrolling text
     */
    //% weight=87 blockGap=8
    //% block="write | %str | to | row | %row | with speed | %speed | ms" 
    //% blockId=write_String
    //% icon="\uf1ab"
    export function writeString(str: string, row: number, speed: number) {

        if (row == 0) {
            row0Speed = speed
            row0 = str
            row0Written = true
        }
        if (row == 1) {
            row1Speed = speed
            row1 = str
            row1Written = true
        }

    }

    function clearrow0() {
        setCursor(0, 0)
        writeLCD("                ")
    }

    function clearrow1() {
        setCursor(0, 1)
        writeLCD("                ")
    }

    function init() {
        if (isnotinitialized) {
            basic.pause(50)

            setLCDCmd(Command.LCD_2LINE | 0x10)
            basic.pause(5)
            setLCDCmd(Command.LCD_2LINE | 0x10)
            basic.pause(1)
            setLCDCmd(Command.LCD_2LINE | 0x10)
            setLCDCmd(Command.LCD_2LINE)
            setLCDCmd(Command.LCD_DISPLAYON)
            setLCDCmd(Command.LCD_CLEARDISPLAY)
            basic.pause(2)
            setLCDCmd(Command.LCD_ENTRYLEFT | Command.LCD_ENTRYSHIFTDECREMENT)
        }
        isnotinitialized = false
    }

    function setLCDCmd(cmd: number) {
        pins.i2cWriteNumber(0x3E, 0x80 << 8 | cmd, NumberFormat.Int16BE)
    }

    function setCursor(col: number, row: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        setLCDCmd(col)
    }



    /**
     * sets the red backgroung color
     * @param r red color to be set
     */
    //% weight=87 blockGap=8
    //% block="set red to | %r" 
    //% blockId=set_red
    //% icon="\uf1ab"
    export function setRed(r: number) {
        setRGBReg(Command.REG_MODE1, 0)
        setRGBReg(Command.REG_MODE2, 0)
        setRGBReg(Command.REG_OUTPUT, 0xAA)
        setRGBReg(4, r)
    }

    /**
     * sets the green backgroung color
     * @param g green color to be set
     */
    //% weight=87 blockGap=8
    //% block="set green to | %g" 
    //% blockId=set_green
    //% icon="\uf1ab"
    export function setGreen(g: number) {
        setRGBReg(Command.REG_MODE1, 0)
        setRGBReg(Command.REG_MODE2, 0)
        setRGBReg(Command.REG_OUTPUT, 0xAA)
        setRGBReg(3, g)
    }

    /**
     * sets the blue backgroung color
     * @param b blue color to be set
     */
    //% weight=87 blockGap=8
    //% block="set blue to | %b"
    //% blockId=set_blue
    //% icon="\uf1ab"
    export function setBlue(b: number) {
        setRGBReg(Command.REG_MODE1, 0)
        setRGBReg(Command.REG_MODE2, 0)
        setRGBReg(Command.REG_OUTPUT, 0xAA)
        setRGBReg(2, b)
    }

    /**
     * sets all backgroung colors
     * @param r red color to be set
     * @param g green color to be set
     * @param b blue color to be set
     */
    //% weight=87 blockGap=8
    //% block="set RGB to | red |  %r | green |  %g | blue |  %b"
    //% blockId=set_rgb
    //% icon="\uf1ab"
    export function setRGB(r: number, g: number, b: number) {
        setRGBReg(Command.REG_MODE1, 0)
        setRGBReg(Command.REG_MODE2, 0)
        setRGBReg(Command.REG_OUTPUT, 0xAA)
        setRGBReg(Command.REG_RED, r)
        setRGBReg(Command.REG_GREEN, g)
        setRGBReg(Command.REG_BLUE, b)
    }

    function setRGBReg(reg: number, value: number) {
        pins.i2cWriteNumber(0x30, reg << 8 | value, NumberFormat.Int16BE)
    }
}

enum Command {
    LCD_ADDRESS = 0x3E,
    RGB_ADDRESS = 0x30,

    //Hintergrundfarben Adressen
    REG_RED = 0x04,
    REG_GREEN = 0x03,
    REG_BLUE = 0x02,

    //Hintergrundfarben modus
    REG_MODE1 = 0x00,
    REG_MODE2 = 0x01,
    REG_OUTPUT = 0x08,

    //command Adressen
    LCD_CLEARDISPLAY = 0x01,
    LCD_RETURNHOME = 0x02,
    LCD_ENTRYMODESET = 0x04,
    LCD_DISPLAYCONTROL = 0x08,
    LCD_CURSORSHIFT = 0x10,
    LCD_FUNCTIONSET = 0x20,
    LCD_SETCGRAMADDR = 0x40,
    LCD_SETDDRAMADDR = 0x80,

    //
    LCD_ENTRYRIGHT = 0x00 | LCD_ENTRYMODESET,
    LCD_ENTRYLEFT = 0x02 | LCD_ENTRYMODESET,
    LCD_ENTRYSHIFTINCREMENT = 0x01 | LCD_ENTRYMODESET,
    LCD_ENTRYSHIFTDECREMENT = 0x00 | LCD_ENTRYMODESET,

    LCD_DISPLAYON = 0x04 | LCD_DISPLAYCONTROL,
    LCD_DISPLAYOFF = 0x00 | LCD_DISPLAYCONTROL,
    LCD_CURSORON = 0x02 | LCD_DISPLAYCONTROL,
    LCD_CURSOROFF = 0x00 | LCD_DISPLAYCONTROL,
    LCD_BLINKON = 0x01 | LCD_DISPLAYCONTROL,
    LCD_BLINKOFF = 0x00 | LCD_DISPLAYCONTROL,

    LCD_DISPLAYMOVE = 0x08 | LCD_CURSORSHIFT,
    LCD_CURSORMOVE = 0x00 | LCD_CURSORSHIFT,
    LCD_MOVERIGHT = 0x04 | LCD_CURSORSHIFT,
    LCD_MOVELEFT = 0x00 | LCD_CURSORSHIFT,

    LCD_8BITMODE = 0x10 | LCD_FUNCTIONSET,
    LCD_4BITMODE = 0x00 | LCD_FUNCTIONSET,
    LCD_2LINE = 0x08 | LCD_FUNCTIONSET,
    LCD_1LINE = 0x00 | LCD_FUNCTIONSET,
    LCD_5x10DOTS = 0x04 | LCD_FUNCTIONSET,
    LCD_5x8DOTS = 0x00 | LCD_FUNCTIONSET
}
