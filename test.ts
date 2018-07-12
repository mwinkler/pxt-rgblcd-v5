rgblcd.setRGB(255, 0, 255)
rgblcd.writeString("500 millisekunden sind schneller als ...", 0, 500)
rgblcd.writeString("2000 millisekunden", 1, 2000)

basic.forever(() => {
})
