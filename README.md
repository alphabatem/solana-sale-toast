# Solana NFT Sale Toast
Automatically display recent sales popups to increase your sales on your online store.

## Quick Start

1. Install Solana Toast
```
yarn add @alphabatem/solana-sale-toast
```


2. Obtain a Hellomoon API Key & DataStream (https://www.hellomoon.io/developers)

[]


3. Setup the solana toast in your code
```js
const apiKey = "" //HelloMoon API Key
const subscriptionId = "" //HelloMoon Datastream ID
const enrichMetadata = true //Retrieve mint image (where available)

this.connection = CreateSolanaToastClient(apiKey, subscriptionId, enrichMetadata)
this.connection.setCollectionFilter(new FilterOpts({
    collectionName: "AlphaBatem", //Filter to collection name
}))
this.connection.listen()
```

4. Filter Options can be used to further filter the inbound datastream (say if you wish for it to be more generic etc) - This also helps for changing dynamically between 
collections (say on a marketplace, just adjust the collectionFilter to match the current browsed collection)
```js
new FilterOpts({
    collectionName: "AlphaBatem", //Filter sales to only this collection
	minPrice: 0.1 //Filter only sales above this price
})
```

5. Include the base theme css file & adjust the style to your suiting
```js
import "@alphabatem/solana-sale-toast/css/solana_toast.css";
```