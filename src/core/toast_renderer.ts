import Toast from "../entities/toast";

export default class ToastRenderer {

	container

	toastTimeout = 10000

	constructor() {
		this.container = this.buildContainerNode()
		document.body.appendChild(this.container)
	}

	add(toast: Toast) {
		const t2 = toast.getHTML()
		this.container.appendChild(t2)
		setTimeout(() => {
			t2.classList.remove("show")
			setTimeout(() => t2.remove(), 1000)
		}, this.toastTimeout)
	}

	clear() {
		this.container.innerHTML = ""
	}

	buildContainerNode() {
		const node = document.createElement("div")

		node.id = "toast-container"
		node.classList.add("toast-container")

		return node
	}

}