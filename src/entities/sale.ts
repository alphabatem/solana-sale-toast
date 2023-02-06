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
		const img = `https://degencdn.com/v1/nfts/${this.mint}/image.jpg` || this.metadata?.image
		const t = new Toast(this.getTitle(),this.getBody(), img)
		t.setLink(`https://explorer.solana.com/tx/${this.transactionId}`)

		return t
	}

	getTitle(): string {
		const mint = `${this.mint.slice(0,3)}...${this.mint.slice(this.mint.length-3)}`
		return `${mint} Sold for ${this.getSalePrice().toPrecision(3)} SOL`
	}

	getBody(): string {
		const mint = `${this.mint.slice(0,3)}...${this.mint.slice(this.mint.length-3)}`
		const buyer = `${this.buyer?.slice(0,3)}...${this.buyer.slice(this.buyer?.length-3)}`

		return `${buyer} just purchased a ${this.collectionName || mint} for ${this.getSalePrice().toPrecision(3)} SOL on ${this.getMarketplace()}`
	}
}