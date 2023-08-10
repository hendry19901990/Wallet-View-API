import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const API_TOKEN = process.env.API_TOKEN;
const ANKR_BASE_URL = `https://rpc.ankr.com/multichain/${process.env.API_TOKEN}`;

app.get('/wallet/balance', async (req, res) => {
    const wallet_address = req.query.wallet_address;
    const cryptocurrency = req.query.cryptocurrency;
    
    const headers = {
        'accept': 'application/json',   
        'content-type': 'application/json'
    };

    try {

        let req = {
            id: 1,
            jsonrpc: '2.0',
            method: 'ankr_getAccountBalance',
            params: {
                walletAddress: `${wallet_address}`
            }
        };

        // Fetch wallet balance
        const accountBalanceResponse = await axios.post(`${ANKR_BASE_URL}/?ankr_getAccountBalance=`, req,
         { headers });
        const accountBalance = accountBalanceResponse.data.result;

        let tokenPrice = accountBalance.assets.find(asset => {
            const symbol = asset.tokenSymbol? asset.tokenSymbol: asset.symbol;
            return symbol === cryptocurrency;
        })

        if(!tokenPrice)
           return res.status(404).json({ error: cryptocurrency + " not found!" });


        // Calculate values and build response  
        const balances = accountBalance.assets.map(asset => {
            const symbol = asset.tokenSymbol? asset.tokenSymbol: asset.symbol;
            const balance = Number.parseFloat(asset.balance);
            const priceInCryptocurrency = tokenPrice.tokenPrice;
            const valueInCryptocurrency = (symbol === cryptocurrency && priceInCryptocurrency > 0) ? balance: priceInCryptocurrency / balance;
            
            return {
                balance: balance + ` ${symbol}`,
                valueInCryptocurrency: valueInCryptocurrency + ` ${cryptocurrency}`,
            };
        });

        const response_data = {
            wallet_address,
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
