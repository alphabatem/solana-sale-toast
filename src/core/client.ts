import {Sale} from "../entities";
import ToastRenderer from "./toast_renderer";

export default class Client {

	connection? : WebSocket

	renderer = new ToastRenderer()

	enrichMetadata = false

	apiKey = ""
	subscriptionId = ""

	datastreamURI = "wss://kiki-stream.hellomoon.io"
	metadataURI = "https://rest-api.hellomoon.io/v0"

	constructor(apiKey: string, subscriptionId: string) {
		this.apiKey = apiKey
		this.subscriptionId = subscriptionId
		this.listen()
	}

	/**
	 * Enrich the sale payload with its required metadata
	 * @param enrich
	 */
	setEnrichMetadata(enrich: boolean) {
		this.enrichMetadata = enrich
	}

	setDataStream(uri: string) {
		this.datastreamURI = uri
	}

	listen() {
		this.connection = new WebSocket(this.datastreamURI);
		this.connection.onopen = () => {
			console.log("Connected to sale stream")
			this._subscribe()
		}
		this.connection.onmessage = this._onMessage
	}

	close() {
		this.connection?.close()
	}

	_subscribe() {
		this.connection?.send(JSON.stringify({
			action: "subscribe",
			apiKey: this.apiKey,
			subscriptionId: this.subscriptionId
		}))
	}

	_onMessage(msg: MessageEvent) {
		try {
			this.onMessage(msg.data)
		} catch (e) {
			console.error(e)
		}
	}

	onMessage(msg: string) {
		const d = JSON.parse(msg)
		if (d === "You have successfully subscribed")
			return

		for (let i = 0; i < d.length; i++)
			this._onSale(d as Sale)
	}

	_onSale(sale: Sale) {
		if (!this.enrichMetadata) {
			return this.onSale(sale)
		}

		this.getSaleMetadata(sale).then((metadata) => {
			sale.setMetadata(metadata)
			this.onSale(sale)
		})
	}


	/**
	 * Called each time a sale is processed
	 * @param sale
	 */
	onSale(sale: Sale) {
		console.log("New Sale", sale)
		this.renderer.add(sale.toToast())
	}


	getSaleMetadata(sale: Sale) {
		return fetch(`${this.metadataURI}/nft/mint_information`).catch((e) => {
			console.error(`unable to fetch metadata for ${sale.mint}`, e)
		})
	}
}

export function CreateWebsocketClient(apiKey: string, subscriptionId: string): Client {
	return new Client(apiKey, subscriptionId)
}