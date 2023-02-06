# Solana NFT Sale Toast
Automatically display recent sales popups to increase your sales on your online store.

![Example Toast](https://github.com/alphabatem/solana-sale-toast/blob/main/docs/img/moon_04.PNG?raw=true)

## Powered By
* HelloMoon Developer platform (https://hellomoon.io)
* DegenCDN for Images (https://degencdn.com)

## Quick Start

1. Install Solana Toast
```
yarn add @alphabatem/solana-sale-toast
```


2. Obtain a Hellomoon API Key & DataStream (https://www.hellomoon.io/developers)

3. Create your data stream (you can add additional filters here if you are only monitoring 1 collection etc) 
![HelloMoon data stream setup](https://github.com/alphabatem/solana-sale-toast/blob/main/docs/img/moon_02.PNG?raw=true)

4. Grab your `subscriptionID` from the `Datastreams` section
![HelloMoon datastreams](https://github.com/alphabatem/solana-sale-toast/blob/main/docs/img/moon_03.PNG?raw=true)

5. Grab your `apiKey` from the `Dashboard` section
![HelloMoon dashboard](https://github.com/alphabatem/solana-sale-toast/blob/main/docs/img/moon_03.PNG?raw=true)

6. Setup the solana toast in your code
```js
const apiKey = "" //HelloMoon API Key
const subscriptionId = "" //HelloMoon Datastream ID
const enrichMetadata = true //Retrieve mint image (where available)

const connection = CreateSolanaToastClient(apiKey, subscriptionId, enrichMetadata)
connection.setCollectionFilter(new FilterOpts({
    collectionName: "AlphaBatem", //Filter to collection name
}))
connection.listen()
```

Top stop the connection run:
```js
connection.close()
```

7. Filter Options can be used to further filter the inbound datastream (say if you wish for it to be more generic etc) - This also helps for changing dynamically between 
collections (say on a marketplace, just adjust the collectionFilter to match the current browsed collection)
```js
new FilterOpts({
    collectionName: "AlphaBatem", //Filter sales to only this collection
	minPrice: 0.1 //Filter only sales above this price
})
```

8. Include the base theme css file & adjust the style to your suiting
```js
import "@alphabatem/solana-sale-toast/css/solana_toast.css";
```

9. All set!
![Example Toast](https://github.com/alphabatem/solana-sale-toast/blob/main/docs/img/moon_04.PNG?raw=true)