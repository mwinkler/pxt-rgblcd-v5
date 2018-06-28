/*
 *	
 */
//% color=#0fbc11 icon="\uf001" block="rgblcd"
namespace rgblcd {

    let isnotinitialized = true

    let row0 = ""
    let row1 = ""
    let row0Speed = 300
    let row1Speed = 300
    let rowWritten = true
    let lcdUsed = false

    control.inBackground(() => {
        let pos0 = 0
        init()
        while (true) {
            while (lcdUsed) {
            }
            basic.pause(1)
            lcdUsed = true
            if (row0.length > 16) {
                if (pos0 == 0) {
                    basic.pause(2000)
                }
                setCursor(0, 0)
                writeLCD(row0.substr(pos0, 16))
                basic.pause(row0Speed)
                pos0 += 1
                if (pos0 == (row0.length - 15)) {
                    pos0 = 0
                    basic.pause(2000)
                }
            } else {
                if (rowWritten) {
                    clearrow0()
                    setCursor(0, 0)
                    writeLCD(row0)
                    rowWritten = false
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

                if (pos1 == 0) {
                    basic.pause(2000)
                }
                setCursor(0, 1)
                writeLCD(row1.substr(pos1, 16))
                basic.pause(row1Speed)
                pos1 += 1
                if (pos1 == (row1.length - 15)) {
                    pos1 = 0
                    basic.pause(2000)
                }
            } else {
                if (rowWritten) {
                    clearrow1()
                    setCursor(0, 1)
                    writeLCD(row1)
                    rowWritten = false
                }
            }
            lcdUsed = false
        }
    })

    /**
     * prints a string on the LCD display
     * @param str text to display
     * @param row row to be written to
     * @param speed speed of the scrolling text
     */
    //% weight=87 blockGap=8
    //% block="write | %str | to | row | %row | with speed | %speed | ms" 
    //% blockId=write_String
    //% icon="\uf1ec"
    export function writeString(str: string, row: number, speed: number) {

        if (row == 0) {
            row0Speed = speed
            row0 = str
        }
        if (row == 1) {
            row1Speed = speed
            row1 = str
        }
        rowWritten = true
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

    // ############    LCD Ansteuerung    ############
    // This will 'right justify' text from the cursor


    function setLCDCmd(cmd: number) {
        pins.i2cWriteNumber(0x3E, 0x80 << 8 | cmd, NumberFormat.Int16BE)
    }

    function setLCDReg(reg: number, value: number) {
        pins.i2cWriteNumber(0x3E, reg << 8 | value, NumberFormat.Int16BE)
    }

    function write(value: number) {
        pins.i2cWriteNumber(0x3E, 0x40 << 8 | value, NumberFormat.Int16BE)
    }

    function setCursor(col: number, row: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        setLCDCmd(col)
    }

    function returnHome() {
        setLCDCmd(Command.LCD_RETURNHOME)
        basic.pause(2)
    }

    export function clear() {
        setLCDCmd(Command.LCD_CLEARDISPLAY)
        basic.pause(2)
    }

    function writeLCD(str: string) {

        let buf = pins.createBuffer(str.length + 1)
        buf[0] = 0x40
        for (let index = 1; index <= str.length; index++) {
            buf[index] = str.charCodeAt(index - 1)
        }
        pins.i2cWriteBuffer(0x3E, buf)
    }



    // ############    Hintergrund Beleuchtung
    // ############

    export function testRGB() {

        let red = 0
        let blue = 0
        let green = 0

        while (true) {
            if (red < 255) {
                red += 1
                setRed(red)
                setGreen(0)
                setBlue(0)
            } else {
                if (blue < 255) {
                    blue += 1
                    setBlue(blue)
                    setRed(0)
                    setGreen(0)
                } else {
                    if (green < 255) {
                        green += 1
                        setGreen(green)
                        setRed(0)
                        setBlue(0)
                    } else {
                        setRed(0)
                        setGreen(0)
                        setBlue(0)
                        red = blue = green = 0
                        break
                    }
                }
            }
        }
    }

    /**
     * sets the red backgroung color
     * @param r red color to be set
     */
    //% weight=87 blockGap=8
    //% block="set red to | %r" 
    //% blockId=set_red
    //% icon="\uf1ec"
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
    //% icon="\uf1ec"
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
    //% icon="\uf1ec"
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
    //% icon="\uf1ec"
    export function setRGB(r: number, g: number, b: number) {
        setRGBReg(Command.REG_MODE1, 0)
        setRGBReg(Command.REG_MODE2, 0)
        setRGBReg(Command.REG_OUTPUT, 0xAA)
        setRGBReg(Command.REG_RED, r)
        setRGBReg(Command.REG_GREEN, g)
        setRGBReg(Command.REG_BLUE, b)
    }

    export function setRGBReg(reg: number, value: number) {
        pins.i2cWriteNumber(0x62, reg << 8 | value, NumberFormat.Int16BE)
    }

}


enum Command {
    LCD_ADDRESS = 0x3E,
    RGB_ADDRESS = 0x62,

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