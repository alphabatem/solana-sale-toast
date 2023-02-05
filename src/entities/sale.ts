import Toast from "./toast";

export class Sale {
	buyer: string
	seller: string
	price: number
	blockId: number
	blockTime: number
	transactionId: string
	transactionPosition: number
	insturctionOrdinal: number
	programId: string
	instructionName: string
	marketName: string
	helloMoonCollectionId: string
	collectionName: string
	mint: string
	marketActionType: string

	//Only available when enriched
	metadata?: any

	constructor(props: any) {
		this.buyer = props.buyer
		this.seller = props.seller
		this.price = props.price
		this.blockId = props.blockId
		this.blockTime = props.blockTime
		this.transactionId = props.transactionId
		this.transactionPosition = props.transactionPosition
		this.insturctionOrdinal = props.insturctionOrdinal
		this.programId = props.programId
		this.instructionName = props.instructionName
		this.marketName = props.marketName
		this.helloMoonCollectionId = props.helloMoonCollectionId
		this.collectionName = props.collectionName
		this.mint = props.mint
		this.marketActionType = props.marketActionType
	}

	setMetadata(metadata: any) {
		this.metadata = metadata
	}

	getMint(): string {
		return this.mint
	}

	getSeller(): string {
		return this.seller
	}

	getBuyer(): string {
		return this.buyer
	}

	getSalePrice(): number {
		return this.price / Math.pow(10, 9)
	}

	getMarketplace(): string {
		switch (this.marketName) {
			case "MEv2":
				return "Magic Eden"
		}

		return this.marketName
	}

	toToast(): Toast {
		const mint = `${this.mint.slice(0,4)}...${this.mint.slice(0,4)}`
		const buyer = `${this.buyer.slice(0,4)}...${this.buyer.slice(0,4)}`

		const title = `${mint} Sold for ${this.getSalePrice()}`
		const body = `${buyer} just purchased ${mint} for ${this.getSalePrice()}`
		const img = this.metadata?.image || ""

		const t = new Toast(title,body, img)
		t.setLink(`https://explorer.solana.com/tx/${this.transactionId}`)

		return t
	}
}