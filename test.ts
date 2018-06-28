rgblcd.setRGB(255, 0, 255)
rgblcd.writeString("500 millisekunden sind schneller wie ...", 0, 500)
rgblcd.writeString("2000 millisekunden oder leute :-P", 1, 2000)

basic.forever(() => {
	testRGB()
})

function testRGB() {

	let red = 0
	let blue = 0
	let green = 0

	while (true) {
		if (red < 255) {
			red += 1
			rgblcd.setRed(red)
			rgblcd.setGreen(0)
			rgblcd.setBlue(0)
		} else {
			if (blue < 255) {
				blue += 1
				rgblcd.setBlue(blue)
				rgblcd.setRed(0)
				rgblcd.setGreen(0)
			} else {
				if (green < 255) {
					green += 1
					rgblcd.setGreen(green)
					rgblcd.setRed(0)
					rgblcd.setBlue(0)
				} else {
					rgblcd.setRed(0)
					rgblcd.setGreen(0)
					rgblcd.setBlue(0)
					red = blue = green = 0
					break
				}
			}
		}
	}
}