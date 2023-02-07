import {Sale} from "../entities";
import ToastRenderer from "./toast_renderer";
import {FilterOpts} from "./filter_opts";


export class Client {

	connection?: WebSocket

	renderer = new ToastRenderer()

	enrichMetadata = false

	filter?: FilterOpts

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

	setCollectionFilter(filter: FilterOpts) {
		this.filter = filter
	}

	listen() {
		this.connection = new WebSocket(this.datastreamURI);
		this.connection.onmessage = (m) => this._onMessage(m)
		this.connection.onopen = () => {
			setTimeout(() => {
				this._subscribe()
			}, 1000) //Stop bug with CONNECTING state
		}
	}

	close() {
		document.querySelectorAll(".sol-toast-container").forEach(e => e.remove());
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

		if (this.filter) {
			if (this.filter.collectionName && sale.collectionName.toLowerCase() == this.filter.collectionName!.toLowerCase())
				return //Filter out
			if (this.filter.minPrice && sale.getSalePrice() <= (this.filter.minPrice! || 0))
				return //Filter out
		}

		if (!this.enrichMetadata) {
			return this.onSale(sale)
		}

		this.getSaleMetadata(sale).then((metadata) => {
			if (!metadata.data || metadata.data.length == 0)
				return this.onSale(sale)

			const fileData = metadata.data[0].nftMetadataJson.uri
			fetch(fileData).then(r => r.json()).then(j => {
				sale.setMetadata(j)
				this.onSale(sale)
			}).catch(e => {
				console.error("Unable to get mint metadata", e)
				this.onSale(sale)
			})
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
		return fetch(`${this.metadataURI}/nft/mint_information`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.apiKey}`,
				"accept": "application/json"
			},
			body: JSON.stringify({
				nftMint: sale.mint,
				limit: 1,
				page: 1
			})
		}).then(r => r.json()).catch((e) => {
			console.error(`unable to fetch metadata for ${sale.mint}`, e)
		})
	}
}

export function CreateSolanaToastClient(apiKey: string, subscriptionId: string, enrichMetadata: boolean = false): Client {
	return new Client(apiKey, subscriptionId, enrichMetadata)
}