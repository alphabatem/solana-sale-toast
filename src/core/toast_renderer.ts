import Toast from "../entities/toast";

export default class ToastRenderer {

	container

	toastTimeout = 10000
	// removeTimeout = 1000
	removeTimeout = 500

	constructor() {
		this.container = this.buildContainerNode()
		document.body.appendChild(this.container)
	}

	add(toast: Toast) {
		const t2 = toast.getHTML()
		this.container.appendChild(t2)
		setTimeout(() => {
			t2.classList.remove("show")
			setTimeout(() => t2.remove(), this.removeTimeout)
		}, this.toastTimeout)
	}

	clear() {
		this.container.innerHTML = ""
	}

	buildContainerNode() {
		const node = document.createElement("div")
		node.classList.add("sol-toast-container")

		return node
	}

}