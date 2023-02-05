export default class Toast {
	title: string
	body: string

	img: string
	link?: string

	constructor(title: string, body: string, img = "") {
		this.title = title
		this.body = body
		this.img = img
	}

	setLink(href: string) {
		this.link = href
	}

	hasImage(): boolean {
		return this.img !== ""
	}

	hasLink(): boolean {
		return !!this.link
	}

	getHTML(): HTMLElement {
		let toast
		if (this.hasLink()) {
			toast = document.createElement("a")
			toast.href = this.link!
		} else
			toast = document.createElement("div")

		toast.classList.add("toast")

		const toastContainer = document.createElement("div")
		toastContainer.classList.add("toast-inner")

		const toastHeader = document.createElement("div")
		toastHeader.classList.add("toast-header")
		toastHeader.appendChild(document.createTextNode(this.title))

		const toastBody = document.createElement("div")
		toastBody.classList.add("toast-body")
		toastBody.appendChild(document.createTextNode(this.body))

		toastContainer.appendChild(toastHeader)
		toastContainer.appendChild(toastBody)


		if (this.hasImage()) {
			const toastImg = document.createElement("div")
			toastImg.classList.add("toast-img")
			const innerImg = document.createElement("img")
			innerImg.src = this.img
			toastImg.appendChild(innerImg)

			toast.appendChild(toastImg)
		}

		toast.appendChild(toastContainer)

		return toast
	}
}