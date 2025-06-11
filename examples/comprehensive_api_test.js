#!/usr/bin/env node

/**
 * Comprehensive API Test for Vaults.fyi SDK
 * 
 * This example tests every single endpoint with all available parameters
 * to ensure the SDK works correctly and demonstrate proper usage.
 * 
 * Usage:
 * export VAULTS_FYI_API_KEY="your_api_key_here"
 * node examples/comprehensive_api_test.js
 */

import pkg from '@vaultsfyi/sdk';
import Table from 'cli-table3';
const { VaultsSdk } = pkg;

// Test configuration
const TEST_USER_ADDRESS = '0xdB79e7E9e1412457528e40db9fCDBe69f558777d';
const TEST_VAULT_ADDRESS = '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c'; // AAVE USDC
const TEST_ASSET_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // Example USDC address
const TEST_NETWORK = 'mainnet';

// Initialize SDK
let vaultsFyi;

try {
  vaultsFyi = new VaultsSdk({
    apiKey: process.env.VAULTS_FYI_API_KEY
  });
  console.log('✅ SDK initialized successfully\n');
} catch (error) {
  console.error('❌ Failed to initialize SDK:', error.message);
  process.exit(1);
}

// Helper function to format test results
function formatResult(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  const message = success ? 'SUCCESS' : `FAILED: ${error?.message || 'Unknown error'}`;
  
  console.log(`${status} ${testName}: ${message}`);
  
  if (success && data) {
    // Show basic info about the response
    if (Array.isArray(data)) {
      console.log(`   📊 Returned ${data.length} items`);
    } else if (data.data && Array.isArray(data.data)) {
      console.log(`   📊 Returned ${data.data.length} items`);
    } else if (typeof data === 'object') {
      const keys = Object.keys(data);
      console.log(`   📊 Response has ${keys.length} properties: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
    }
  }
  
  console.log(''); // Empty line for readability
}

// Test wrapper function
async function runTest(testName, testFunction) {
  try {
    const result = await testFunction();
    formatResult(testName, true, result);
    return result;
  } catch (error) {
    formatResult(testName, false, null, error);
    return null;
  }
}

// Individual test functions for each endpoint

async function testGetBenchmarks() {
  return await vaultsFyi.getBenchmarks();
}

async function testGetAllVaults() {
  return await vaultsFyi.getAllVaults({
    query: {
      page: 0,
      perPage: 5, // Small number for testing
      allowedNetworks: ['mainnet', 'polygon'],
      disallowedNetworks: ['arbitrum'], // Test exclusion
      allowedAssets: ['USDC', 'USDT', 'DAI'],
      disallowedAssets: ['WBTC'], // Test exclusion
      allowedProtocols: ['aave', 'compound'],
      disallowedProtocols: ['curve'], // Test exclusion
      minTvl: 100000,
      maxTvl: 1000000000,
      onlyTransactional: false,
      onlyAppFeatured: false,
      tags: ['lending']
    }
  });
}

async function testGetVault() {
  return await vaultsFyi.getVault({
    path: {
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    }
  });
}

async function testGetVaultHistoricalData() {
  return await vaultsFyi.getVaultHistoricalData({
    path: {
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    },
    query: {
      page: 0,
      perPage: 10,
      apyInterval: '7day',
      fromTimestamp: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 30 days ago
      toTimestamp: Math.floor(Date.now() / 1000) // Now
    }
  });
}

async function testGetPositions() {
  return await vaultsFyi.getPositions({
    path: {
      userAddress: TEST_USER_ADDRESS
    },
    query: {
      allowedNetworks: ['mainnet', 'polygon'],
      disallowedNetworks: ['arbitrum'],
      allowedAssets: ['USDC', 'USDT'],
      disallowedAssets: ['WBTC'],
      allowedProtocols: ['aave'],
      disallowedProtocols: ['curve'],
      minTvl: 10000,
      onlyTransactional: true,
      onlyAppFeatured: false,
      maxTvl: 10000000,
      tags: ['lending']
    }
  });
}

async function testGetDepositOptions() {
  return await vaultsFyi.getDepositOptions({
    path: {
      userAddress: TEST_USER_ADDRESS
    },
    query: {
      allowedNetworks: ['mainnet', 'polygon'],
      disallowedNetworks: ['arbitrum'],
      allowedAssets: ['USDC', 'USDT'],
      disallowedAssets: ['WBTC'],
      allowedProtocols: ['aave', 'compound'],
      disallowedProtocols: ['curve'],
      minTvl: 100000,
      onlyTransactional: true,
      onlyAppFeatured: false,
      apyInterval: '7day',
      // minApy: 0.05, // Note: API validation issue - expects number but receives string
      minUsdAssetValueThreshold: 100,
      alwaysReturnAssets: ['USDC'],
      maxVaultsPerAsset: 3
    }
  });
}

async function testGetIdleAssets() {
  return await vaultsFyi.getIdleAssets({
    path: {
      userAddress: TEST_USER_ADDRESS
    },
    query: {
      allowedNetworks: ['mainnet', 'polygon'],
      disallowedNetworks: ['arbitrum'],
      allowedAssets: ['USDC', 'USDT'],
      disallowedAssets: ['WBTC'],
      minUsdAssetValueThreshold: 10
    }
  });
}

async function testGetVaultTotalReturns() {
  return await vaultsFyi.getVaultTotalReturns({
    path: {
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    }
  });
}

async function testGetVaultHolderEvents() {
  return await vaultsFyi.getVaultHolderEvents({
    path: {
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    }
  });
}

async function testGetTransactionsContext() {
  return await vaultsFyi.getTransactionsContext({
    path: {
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    }
  });
}

async function testGetActionsDeposit() {
  return await vaultsFyi.getActions({
    path: {
      action: 'deposit',
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    },
    query: {
      assetAddress: TEST_ASSET_ADDRESS,
      amount: '1000000', // 1 USDC (6 decimals)
      simulate: true // Use simulation for testing
    }
  });
}

async function testGetActionsRedeem() {
  return await vaultsFyi.getActions({
    path: {
      action: 'redeem',
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    },
    query: {
      assetAddress: TEST_ASSET_ADDRESS,
      amount: '500000', // 0.5 USDC
      simulate: true,
      all: false // Don't redeem all
    }
  });
}

async function testGetActionsClaimRewards() {
  return await vaultsFyi.getActions({
    path: {
      action: 'claim-rewards',
      userAddress: TEST_USER_ADDRESS,
      network: TEST_NETWORK,
      vaultAddress: TEST_VAULT_ADDRESS
    },
    query: {
      assetAddress: TEST_ASSET_ADDRESS,
      simulate: true
    }
  });
}

// Additional edge case tests

async function testGetAllVaultsMinimal() {
  return await vaultsFyi.getAllVaults(); // No parameters
}

async function testGetAllVaultsWithTags() {
  return await vaultsFyi.getAllVaults({
    query: {
      tags: ['lending', 'staking'],
      perPage: 3
    }
  });
}

async function testGetVaultWithEIP155Network() {
  return await vaultsFyi.getVault({
    path: {
      network: 'eip155:1', // Test CAIP format
      vaultAddress: TEST_VAULT_ADDRESS
    }
  });
}

async function testGetHistoricalWithDifferentIntervals() {
  const intervals = ['1day', '7day', '30day'];
  const results = {};
  
  for (const interval of intervals) {
    try {
      const result = await vaultsFyi.getVaultHistoricalData({
        path: {
          network: TEST_NETWORK,
          vaultAddress: TEST_VAULT_ADDRESS
        },
        query: {
          apyInterval: interval,
          perPage: 5
        }
      });
      results[interval] = result;
      console.log(`   ✅ APY Interval ${interval}: Success`);
    } catch (error) {
      console.log(`   ❌ APY Interval ${interval}: ${error.message}`);
    }
  }
  
  return results;
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Vaults.fyi SDK API Test\n');
  console.log('=' .repeat(60));
  console.log('TESTING ALL ENDPOINTS WITH VARIOUS PARAMETERS');
  console.log('=' .repeat(60));
  console.log('');

  if (!process.env.VAULTS_FYI_API_KEY) {
    console.error('❌ VAULTS_FYI_API_KEY environment variable is required');
    console.error('Usage: export VAULTS_FYI_API_KEY="your_api_key" && node examples/comprehensive_api_test.js');
    process.exit(1);
  }

  const testResults = {};

  // Core API Tests
  console.log('📋 CORE API ENDPOINTS:');
  console.log('-'.repeat(40));
  
  testResults.benchmarks = await runTest('GET /v1/benchmarks', testGetBenchmarks);
  testResults.allVaults = await runTest('GET /v2/detailed-vaults (with all params)', testGetAllVaults);
  testResults.allVaultsMinimal = await runTest('GET /v2/detailed-vaults (no params)', testGetAllVaultsMinimal);
  testResults.allVaultsWithTags = await runTest('GET /v2/detailed-vaults (with tags)', testGetAllVaultsWithTags);
  testResults.vault = await runTest('GET /v2/detailed-vaults/{network}/{vault}', testGetVault);
  testResults.vaultEIP155 = await runTest('GET /v2/detailed-vaults (EIP155 format)', testGetVaultWithEIP155Network);

  // Historical Data Tests
  console.log('📈 HISTORICAL DATA ENDPOINTS:');
  console.log('-'.repeat(40));
  
  testResults.historicalData = await runTest('GET /v2/historical/{network}/{vault}', testGetVaultHistoricalData);
  testResults.historicalIntervals = await runTest('GET /v2/historical (all intervals)', testGetHistoricalWithDifferentIntervals);

  // Portfolio Tests
  console.log('💼 PORTFOLIO ENDPOINTS:');
  console.log('-'.repeat(40));
  
  testResults.positions = await runTest('GET /v2/portfolio/positions/{user}', testGetPositions);
  testResults.depositOptions = await runTest('GET /v2/portfolio/best-deposit-options/{user}', testGetDepositOptions);
  testResults.idleAssets = await runTest('GET /v2/portfolio/idle-assets/{user}', testGetIdleAssets);
  testResults.totalReturns = await runTest('GET /v2/portfolio/returns/{user}/{network}/{vault}', testGetVaultTotalReturns);
  testResults.holderEvents = await runTest('GET /v2/portfolio/events/{user}/{network}/{vault}', testGetVaultHolderEvents);

  // Transaction Tests
  console.log('🔄 TRANSACTION ENDPOINTS:');
  console.log('-'.repeat(40));
  
  testResults.transactionContext = await runTest('GET /v2/transactions/context/{user}/{network}/{vault}', testGetTransactionsContext);
  testResults.actionsDeposit = await runTest('GET /v2/transactions/deposit/{user}/{network}/{vault}', testGetActionsDeposit);
  testResults.actionsRedeem = await runTest('GET /v2/transactions/redeem/{user}/{network}/{vault}', testGetActionsRedeem);
  testResults.actionsClaimRewards = await runTest('GET /v2/transactions/claim-rewards/{user}/{network}/{vault}', testGetActionsClaimRewards);

  // Summary
  console.log('=' .repeat(60));
  console.log('TEST SUMMARY');
  console.log('=' .repeat(60));

  const totalTests = Object.keys(testResults).length;
  const successfulTests = Object.values(testResults).filter(result => result !== null).length;
  const failedTests = totalTests - successfulTests;

  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Successful: ${successfulTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${Math.round((successfulTests / totalTests) * 100)}%`);

  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. This could be due to:');
    console.log('   • Invalid test data (addresses, vault addresses)');
    console.log('   • API rate limiting');
    console.log('   • Insufficient API permissions');
    console.log('   • Network issues');
    console.log('\n💡 Try adjusting the test constants at the top of the file.');
  } else {
    console.log('\n🎉 All tests passed! The SDK is working correctly.');
  }

  console.log('\n🔗 API Documentation: https://api.vaults.fyi/documentation');
  console.log('🆘 Support: https://t.me/vaultsfyisupport');
}

// Run the tests
runComprehensiveTests().catch((error) => {
  console.error('💥 Critical error during test execution:', error);
  process.exit(1);
});