# Vaults.fyi SDK Example Implementation

This example demonstrates how to use the vaults.fyi SDK (`@vaultsfyi/sdk`) to:
1. Find the best deposit options for a specific address
2. Generate transaction payloads for depositing into vaults
3. View user positions and balances

## Prerequisites

- Node.js installed
- An API key from vaults.fyi
- Basic understanding of DeFi and Ethereum addresses

## Setup

1. Clone or download this example project
2. Install dependencies:
```bash
npm install
```

3. Set your API key as an environment variable:
```bash
export VAULTS_FYI_API_KEY="your_api_key_here"
```

## Usage

### 1. SDK Initialization

```javascript
import pkg from '@vaultsfyi/sdk';
const { VaultsSdk } = pkg;

// Initialize the SDK
const vaultsFyi = new VaultsSdk({
  apiKey: process.env.VAULTS_FYI_API_KEY,
  network: 'ethereum'
});
```

### 2. Viewing User Balances

```javascript
async function getUserBalances() {
  const idleAssets = await vaultsFyi.getIdleAssets({
    path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' }
  });
  
  return idleAssets;
}
```

### 3. Finding Best Deposit Options

```javascript
async function getBestDepositOptions() {
  const depositOptions = await vaultsFyi.getDepositOptions({
    path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' },
    query: { allowedAssets: ['USDC', 'USDS'] }
  });
  
  return depositOptions;
}
```

### 4. Generating Deposit Transactions

```javascript
async function generateDepositTransaction(vaultAddress, amount, userAddress, network, assetAddress) {
  const transaction = await vaultsFyi.getActions({
    path: { 
      action: 'deposit',
      userAddress: userAddress,
      network: network, 
      vaultAddress: vaultAddress
    },
    query: { 
      amount: amount,
      assetAddress: assetAddress,
      simulate: false
    }
  });
  
  return transaction;
}
```

### 5. Viewing User Positions

```javascript
async function getUserPositions() {
  const positions = await vaultsFyi.getPositions({
    path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' }
  });
  
  return positions;
}
```

## Running the Example

1. Make sure you have your API key set:
```bash
export VAULTS_FYI_API_KEY="your_api_key_here"
```

2. Run the example:
```bash
npm start
```

The example will:
- Check user balances (idle assets)
- Display the best deposit options in a formatted table
- Generate a transaction payload for the 3rd vault option
- Show all user positions

## Key SDK Methods

- `getIdleAssets()` - Get user's idle/available balances
- `getDepositOptions()` - Get best deposit options for an address
- `getActions()` - Generate transaction payloads for deposits/withdrawals
- `getPositions()` - Get all user positions across vaults

