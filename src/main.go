package main

import webview "github.com/webview/webview_go"

const html = `<script src="http://localhost:20080/app.js"></script><link href="http://localhost:20080/app.css" rel="stylesheet">`

func main() {
	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("Alluvial Editor")
	w.SetSize(480, 320, webview.HintNone)

	// w.SetHtml(html)
	w.Navigate("http://localhost:3000/")
	w.Run()
}
