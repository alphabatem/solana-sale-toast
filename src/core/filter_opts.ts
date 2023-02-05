export class FilterOpts {
	collectionName?: string
	minPrice?: number

	constructor(props: any) {
		this.collectionName = props.collectionName
		this.minPrice = props.minPrice
	}

}