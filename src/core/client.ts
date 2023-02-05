import {Sale} from "../entities";
import ToastRenderer from "./toast_renderer";

export default class Client {

	connection?: WebSocket

	renderer = new ToastRenderer()

	enrichMetadata = false

	apiKey = ""
	subscriptionId = ""

	datastreamURI = "wss://kiki-stream.hellomoon.io"
	metadataURI = "https://rest-api.hellomoon.io/v0"

	constructor(apiKey: string, subscriptionId: string, enrichMetadata = false) {
		this.apiKey = apiKey
		this.subscriptionId = subscriptionId
		this.enrichMetadata = enrichMetadata
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
		this.connection.onmessage = (m) => this._onMessage(m)
		this.connection.onopen = () => {
			setTimeout(() => this._subscribe(), 600) //Stop bug with CONNECTING state
		}
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
			this._onSale(new Sale(d[i]))
	}

	_onSale(sale: Sale) {
		if (sale.marketActionType !== "SALE")
			return //Prevent buggy data

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