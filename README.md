## Designing the Wallet View API for displaying wallet asset balances in a given cryptocurrency


Designing the Wallet View API for displaying wallet asset balances in a given cryptocurrency involves several components, including handling user input, retrieving wallet balances, fetching token prices, and performing currency conversions. Here's a high-level design for the API:

### 1. API Endpoints:

GET `/wallet/balance?wallet_address=0x23A&cryptocurrency=BNB`: This endpoint will receive user input in the query path containing the wallet address and the desired cryptocurrency. It will return the wallet's asset balances in the specified cryptocurrency.
Data Structures:

WalletBalanceRequest (Query path):

```json
{
  "wallet_address": "0x23A...",
  "cryptocurrency": "BNB"
}
```

WalletBalanceResponse (JSON output):

```json
{
  "wallet_address": "0x18b2a687610328590bc8f2e5fedde3b582a49cda",
  "cryptocurrency": "BNB",
  "balances": [
    {
      "balance": "1.116063312048596 ETH",
      "valueInCryptocurrency":"216.96254706179266 BNB"
    }
  ]
}
```

### 2. Internal Flow:

Upon receiving a request, the API endpoint will validate the input wallet address and cryptocurrency symbol.
It will then use the Ankr API to fetch the account balance for the provided wallet address.
Next, the API will use the Ankr token price API to get the exchange rate of the specified cryptocurrency against each asset's token symbol.
The API will perform currency conversions to calculate the value of each asset in the desired cryptocurrency.
The response will include the wallet address, specified cryptocurrency, and a list of asset balances with their values in the specified cryptocurrency.

### 3. Assumptions and Considerations:

The user input validation should include checks for the correct format of the wallet address and the availability of the cryptocurrency symbol.
Error handling mechanisms should be in place to handle cases where the Ankr API requests fail or return unexpected responses.
Caching mechanisms could be implemented to reduce the number of API calls for token prices, especially for frequently used symbols.
The API might need to limit the number of assets displayed in the response to avoid overwhelming the user with information.
Authentication and rate limiting should be implemented to secure the API and prevent abuse.

## Running the sample app.js

### 1. Install dependecies and run the app
```bash
npm install
node app.js
```
### 2. Edit the file .env with your ankr token
```bash
API_TOKEN='7925...'
```

### 3. Test it
```bash
curl "http://localhost:3000/wallet/balance?wallet_address=0x18b2a687610328590bc8f2e5fedde3b582a49cda&cryptocurrency=BNB"
```

output:
```bash
{
  "wallet_address": "0x18b2a687610328590bc8f2e5fedde3b582a49cda",
  "cryptocurrency": "BNB",
  "balances": [
    {
      "balance": "1.116063312048596 ETH",
      "valueInCryptocurrency":"216.96254706179266 BNB"
    }
  ]
}
```


