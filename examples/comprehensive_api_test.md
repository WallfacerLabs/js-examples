# Comprehensive API Test

This example demonstrates how to test every single endpoint in the Vaults.fyi SDK with all available parameters. It's designed to verify that the SDK is working correctly and to showcase proper usage of each method.

## What it Tests

### Core API Endpoints
- **GET /v1/benchmarks** - Benchmark data for performance comparison
- **GET /v2/detailed-vaults** - All vaults with comprehensive filtering
- **GET /v2/detailed-vaults/{network}/{vault}** - Individual vault details

### Historical Data Endpoints
- **GET /v2/historical/{network}/{vault}** - Historical APY and TVL data
- Tests all APY intervals: `1day`, `7day`, `30day`

### Portfolio Endpoints
- **GET /v2/portfolio/positions/{user}** - User's active positions
- **GET /v2/portfolio/best-deposit-options/{user}** - Optimal deposit recommendations
- **GET /v2/portfolio/idle-assets/{user}** - Assets not earning yield
- **GET /v2/portfolio/returns/{user}/{network}/{vault}** - Total returns for specific vault
- **GET /v2/portfolio/events/{user}/{network}/{vault}** - Transaction history

### Transaction Endpoints
- **GET /v2/transactions/context/{user}/{network}/{vault}** - Transaction context
- **GET /v2/transactions/deposit/{user}/{network}/{vault}** - Deposit transaction data
- **GET /v2/transactions/redeem/{user}/{network}/{vault}** - Withdrawal transaction data
- **GET /v2/transactions/claim-rewards/{user}/{network}/{vault}** - Reward claiming

## Parameters Tested

The example tests all available parameters for each endpoint:

### Filtering Parameters
- `allowedNetworks` / `disallowedNetworks` - Network inclusion/exclusion
- `allowedAssets` / `disallowedAssets` - Asset filtering
- `allowedProtocols` / `disallowedProtocols` - Protocol filtering
- `minTvl` / `maxTvl` - TVL range filtering
- `minApy` - Minimum APY threshold
- `onlyTransactional` - Include only transaction-supported vaults
- `onlyAppFeatured` - Include only app-featured vaults
- `tags` - Filter by vault tags

### Pagination Parameters
- `page` - Page number (0-based)
- `perPage` - Items per page

### Time-based Parameters
- `apyInterval` - APY calculation period (`1day`, `7day`, `30day`)
- `fromTimestamp` / `toTimestamp` - Time range for historical data

### Transaction Parameters
- `assetAddress` - Asset contract address (required)
- `amount` - Transaction amount
- `simulate` - Simulation mode for safe testing
- `all` - Redeem all assets flag

### Advanced Parameters
- `minUsdAssetValueThreshold` - Minimum asset value
- `alwaysReturnAssets` - Assets to always include
- `maxVaultsPerAsset` - Limit vaults per asset

## Usage

1. Set your API key:
```bash
export VAULTS_FYI_API_KEY="your_api_key_here"
```

2. Run the comprehensive test:
```bash
npm run comprehensive-test
```

Or directly:
```bash
node examples/comprehensive_api_test.js
```

## Customization

You can modify the test constants at the top of the file:

```javascript
const TEST_USER_ADDRESS = '0xdB79e7E9e1412457528e40db9fCDBe69f558777d';
const TEST_VAULT_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const TEST_ASSET_ADDRESS = '0xA0b86a33E6b2e7d8bB9bdB1c23f6fD7b52b5c8e2';
const TEST_NETWORK = 'mainnet';
```

## Expected Output

The test will show:
- ✅ Successful endpoint calls with response metadata
- ❌ Failed calls with error messages
- 📊 Summary statistics (total tests, success rate)
- 💡 Troubleshooting hints for failures

## Common Failure Reasons

- **Invalid addresses**: Update test constants with valid addresses for your use case
- **API rate limiting**: Wait between test runs
- **Insufficient permissions**: Check your API key tier
- **Network issues**: Verify internet connectivity

## Benefits

This comprehensive test helps you:
1. **Verify SDK functionality** - Ensure all methods work correctly
2. **Learn parameter usage** - See examples of every available parameter
3. **Debug issues** - Identify API or SDK problems quickly
4. **Performance testing** - Understand API response times
5. **Integration validation** - Confirm your setup works before building applications

## Next Steps

After running this test successfully, you can:
- Use individual methods in your application
- Modify parameters for your specific use case
- Build more complex workflows combining multiple endpoints
- Integrate with your existing DeFi applications

For production use, consider:
- Error handling and retry logic
- Rate limiting respect
- Caching strategies for frequently accessed data
- User input validation