import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const API_TOKEN = process.env.API_TOKEN;
const ANKR_BASE_URL = `https://rpc.ankr.com/multichain/${process.env.API_TOKEN}`;
console.log(ANKR_BASE_URL);

app.get('/wallet/balance', async (req, res) => {
    const wallet_address = req.query.wallet_address;
    const cryptocurrency = req.query.cryptocurrency;
    
    const headers = {
        'accept': 'application/json',   
        'content-type': 'application/json'
    };

    try {

        // Fetch wallet balance
        const accountBalanceResponse = await axios.post(`${ANKR_BASE_URL}/?ankr_getAccountBalance=`, {
            id: 1,
            jsonrpc: '2.0',
            method: 'ankr_getAccountBalance',
            params: {
                walletAddress: `${wallet_address}`
            }
        },
         { headers });
        const accountBalance = accountBalanceResponse.data.result;

        // Fetch token prices
        const tokenPriceResponse = await axios.post(
            `${ANKR_BASE_URL}/?ankr_getTokenPrice=`,
            {
                id: 1,
                jsonrpc: "2.0",
                method: "ankr_getTokenPrice",
                params: {
                    blockchain: `eth`
                }
            },
            {headers}
        );
        const tokenPrices = tokenPriceResponse.data.result;

        // Calculate values and build response  
        const balances = accountBalance.assets.map(asset => {
            const symbol = asset.tokenSymbol? asset.tokenSymbol: asset.symbol;
            const balance = asset.balance;
            const priceInCryptocurrency = tokenPrices.usdPrice;
            const valueInCryptocurrency = balance * priceInCryptocurrency;
            return {
                symbol,
                balance,
                value_in_cryptocurrency: valueInCryptocurrency
            };
        });

        const response_data = {
            wallet_address,
            cryptocurrency,
            balances
        };
        
        res.json(response_data);
    } catch (error) {
         console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
