# Solana Fellowship Program 2024 - Module 8 - Compressed NFTs

Create a cNFT collection of your own profile picture and social links as metadata and airdrop it to other fellows.



This is typically accomplished in a few steps: 
1. Setting up the Merkle tree.
2. Setting up the collection.
3. Minting the compressed NFTs.
4. Transferring to another wallet. 

# Setting up the project `.env`

## Generate wallets 
```bash
solana-keygen grind --starts-with F:3
```

Result: 
```
Searching with 10 threads for:
	3 pubkeys that start with 'F' and end with ''
Wrote keypair to FYFgMZiPFz614cSqspfDgCxWBNJDfTxWurY78wnE49Y9.json
Wrote keypair to FEtVr7i1QP2fgnPoc2WtH8FKcEPuQRJoc4TajeL9Yp9e.json
Wrote keypair to FYMJxSUDJoyYAwY6zyb2oWWJaJ9UyfPtTECgD1E8Q1zh.json
```


## env.example

```bash
HELIUS_RPC_URL=<your helius endpoint>
SOLANA_RPC=https://api.devnet.solana.com
COLLECTION_METADATA=https://shdw-drive.genesysgo.net/QZNGUVnJgkw6sGQddwZVZkhyUWSUXAjXF9HQAjiVZ55/collection.json
NFT_METADATA=https://shdw-drive.genesysgo.net/QZNGUVnJgkw6sGQddwZVZkhyUWSUXAjXF9HQAjiVZ55/collection.json
KEYPAIR_SRC="./FEtVr7i1QP2fgnPoc2WtH8FKcEPuQRJoc4TajeL9Yp9e.json"
MERKLE_TREE_SRC="./FYFgMZiPFz614cSqspfDgCxWBNJDfTxWurY78wnE49Y9.json"
COLLECTION_MINT_WALLET="./FYMJxSUDJoyYAwY6zyb2oWWJaJ9UyfPtTECgD1E8Q1zh.json"
COLLECTION_MINT=FYMJxSUDJoyYAwY6zyb2oWWJaJ9UyfPtTECgD1E8Q1zh
COLLECTION_SIZE=5
ASSET_ID=0
INDEX_NFT=
```



## Step 0 - Install dependencies

```bash
npm install
```

# Step 1 - Create Merkle

Noted: Faucet to account `KEYPAIR_SRC` -> This accout is signer transaction 

```
npm run merkle
```

Result tx signature:

```
Signature: nX4fXjqKR6GXHVpxihXXn96iHTGMrjHtZZvFyUuxhMT2dr2PfJZsr3R2Hjsd7yuuHdzaKGYQ9bmosuCWEYYRUsP
```


# Step 2 - Create Collection

Change `name` and `symbol` in `src/collection.ts` 

For example

```javascript
      createMetadataAccountArgsV3: {
        data: {
          name: "Dustin cNFTs",
          symbol: "DUSTIN",
          uri: env.COLLECTION_METADATA,
          sellerFeeBasisPoints: 0,
          creators: [
            { address: keypair.publicKey, verified: true, share: 100 },
          ],
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
```

Result:
```
Successfull created NFT collection with collection address: FYMJxSUDJoyYAwY6zyb2oWWJaJ9UyfPtTECgD1E8Q1zh
```





# Step 3 - Mint NFTs
Change `name` and `symbol` in `src/mint.ts` 

```
      metadataArgs: {
        collection: { key: collectionMint, verified: false },
        creators: [{ address: keypair.publicKey, verified: true, share: 100 }],
        isMutable: true,
        name: "Dustin cNFTs",
        primarySaleHappened: true,
        sellerFeeBasisPoints: 0,
        symbol: "DUSTIN",
        uri: env.NFT_METADATA,
        uses: null,
        editionNonce: null,
        tokenStandard: null,
        tokenProgramVersion: TokenProgramVersion.Original,
      },
```



# Step 4 - Transfer NFTs


Noted: Replace your destination address in `src/transfer.ts` 

```javascript
      newLeafOwner: new PublicKey(
        "MiCQoU7dk3ddXTNPjFfFwC3YuXNDfZuuqDwd19Cmgpg"
      ),
```
```bash
npm run transfer
```


