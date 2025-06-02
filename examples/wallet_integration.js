import pkg from '@vaultsfyi/sdk';
import Table from 'cli-table3';
const { VaultsSdk } = pkg;

// Initialize the SDK
const vaultsFyi = new VaultsSdk({
  apiKey: process.env.VAULTS_FYI_API_KEY,
  network: 'ethereum'
});

// SDK initialized successfully

// Example address
const userAddress = '0xdB79e7E9e1412457528e40db9fCDBe69f558777d';

// Helper functions for pretty printing
function formatTransactionBlob(transaction) {
  if (!transaction || typeof transaction !== 'object') {
    return 'No transaction data available';
  }

  const table = new Table({
    head: ['Property', 'Value'],
    colWidths: [25, 80]
  });

  // Helper function to format values
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.length > 75) return value.slice(0, 75) + '...';
    return String(value);
  };

  // Add transaction properties to table
  Object.entries(transaction).forEach(([key, value]) => {
    table.push([key, formatValue(value)]);
  });

  return '\n🎯 Generated Transaction Blob:\n' + table.toString();
}

function formatDepositOptions(depositOptionsResponse) {
  if (!depositOptionsResponse || !depositOptionsResponse.userBalances) {
    return 'No deposit options available';
  }

  const table = new Table({
    head: ['Asset', 'Balance USD', 'Network', 'Vault Name', 'Protocol', 'APY'],
    colWidths: [8, 12, 10, 20, 12, 8]
  });

  depositOptionsResponse.userBalances?.forEach(balance => {
    balance.depositOptions?.forEach(option => {
      table.push([
        balance.asset?.symbol || 'N/A',
        balance.asset?.balanceUsd ? `$${parseFloat(balance.asset.balanceUsd).toFixed(2)}` : 'N/A',
        option.network?.name || 'N/A',
        option.name ? (option.name.length > 18 ? option.name.slice(0, 18) + '...' : option.name) : 'N/A',
        option.protocol?.name || 'N/A',
        option.apy?.total ? (option.apy.total * 100).toFixed(2) + '%' : 'N/A'
      ]);
    });
  });

  return table.toString();
}

function formatPositions(positions) {
  if (!positions || !positions.data || !Array.isArray(positions.data)) {
    return 'No positions available';
  }

  const table = new Table({
    head: ['Network', 'Protocol', 'Vault Name', 'Asset', 'Balance USD', 'APY'],
    colWidths: [10, 12, 18, 8, 12, 8]
  });

  let hasPositions = false;

  positions.data.forEach(position => {
    hasPositions = true;
    const vaultName = position.name || 'Unknown Vault';
    const shortVaultName = vaultName.length > 16 ? vaultName.slice(0, 16) + '...' : vaultName;
    
    table.push([
      position.network?.name || 'N/A',
      position.protocol?.name || 'N/A',
      shortVaultName,
      position.asset?.symbol || 'N/A',
      position.asset?.balanceUsd ? '$' + parseFloat(position.asset.balanceUsd).toFixed(2) : 'N/A',
      position.apy?.total ? (position.apy.total * 100).toFixed(2) + '%' : 'N/A'
    ]);
  });

  return hasPositions ? table.toString() : 'No active positions found';
}

function formatUserBalances(idleAssets) {
  if (!idleAssets || !idleAssets.data || !Array.isArray(idleAssets.data)) {
    return 'No idle assets available';
  }

  const table = new Table({
    head: ['Asset', 'Balance', 'Balance USD', 'Network'],
    colWidths: [12, 18, 15, 12]
  });

  let hasBalances = false;

  idleAssets.data.forEach(asset => {
    hasBalances = true;
    const balanceFormatted = asset.balanceNative ? 
      parseFloat(asset.balanceNative).toFixed(6) + ' ' + asset.symbol : 'N/A';
    
    table.push([
      asset.symbol || 'N/A',
      balanceFormatted,
      asset.balanceUsd ? '$' + parseFloat(asset.balanceUsd).toFixed(2) : 'N/A',
      asset.network?.name || 'N/A'
    ]);
  });

  return hasBalances ? table.toString() : 'No idle assets found';
}

async function getUserBalances() {
  try {
    const idleAssets = await vaultsFyi.getIdleAssets({
      path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' }
    });
    
    console.log('💰 User balances:');
    console.log(formatUserBalances(idleAssets));
    return idleAssets;
  } catch (error) {
    console.error('Error fetching user balances:', error.message);
  }
}

async function getBestDepositOptions() {
  try {
    // Use getDepositOptions method with allowedAssets parameter
    const depositOptions = await vaultsFyi.getDepositOptions({
      path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' },
      query: { allowedAssets: ['USDC', 'USDS'] }
    });
    
    console.log('📊 Best deposit options (USDC/USDS only):');
    console.log(formatDepositOptions(depositOptions));
    return depositOptions;
  } catch (error) {
    console.error('Error fetching deposit options:', error.message);
  }
}


async function generateDepositTransactionWithAsset(vaultAddress, amount, userAddress, network = 'mainnet', assetAddress) {
  try {
    // Use the correct method: getActions (for actual transactions)
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
    
    console.log(formatTransactionBlob(transaction));
    return transaction;
  } catch (error) {
    console.log('❌ Transaction generation failed:', error.message);
    console.log('Full error:', error);
    return { 
      success: false, 
      message: 'Transaction generation failed',
      error: error.message
    };
  }
}

async function getUserPositions() {
  try {
    // Use getPositions method (updated SDK version)
    const positions = await vaultsFyi.getPositions({
      path: { userAddress: '0xdB79e7E9e1412457528e40db9fCDBe69f558777d' }
    });
    
 
    console.log(formatPositions(positions));
    return positions;
  } catch (error) {
    console.error('Error fetching user positions:', error.message);
  }
}

// Removed getUserBalances as requested


async function runExampleImplementation() {
  const address = '0xdB79e7E9e1412457528e40db9fCDBe69f558777d';
  
  console.log('🔷 ===== Vaults.fyi SDK Example Implementation ===== 🔷\n');
  
  if (!process.env.VAULTS_FYI_API_KEY) {
    console.error('Please set VAULTS_FYI_API_KEY environment variable');
    return;
  }
  
  // 0. Show user balances
  console.log('💰 0. Checking user balances...');
  await getUserBalances();
  
  // 1. Get best deposit options
  console.log('\n📈 1. Finding best deposit options...');
  const topOptions = await getBestDepositOptions();
  
  // 2. Generate a deposit transaction (if we have deposit options)
  if (topOptions?.userBalances?.[0]?.depositOptions?.[2]) {
    const firstAsset = topOptions.userBalances[0];
    const firstDepositOption = firstAsset.depositOptions[2]; // Use 3rd vault (index 2)
    const vaultName = firstDepositOption.name || 'Unknown vault';
    console.log(`\n💳 2. Generating deposit transaction into ${vaultName}...`);
    
    // Extract vault address and asset address from the deposit option
    const vaultAddress = firstDepositOption.address;
    const assetAddress = firstAsset.asset?.address;
    
    // Extract network string from the deposit option
    let network = 'mainnet'; // Use 'mainnet' to match API expectations
    if (firstDepositOption.network) {
      network = typeof firstDepositOption.network === 'string' 
        ? firstDepositOption.network 
        : firstDepositOption.network.name || 'mainnet';
    }
    
    if (vaultAddress && assetAddress) {
      const amount = '1000000'; // 1 USDC (6 decimals)
      
      await generateDepositTransactionWithAsset(
        vaultAddress,
        amount,
        address,
        network,
        assetAddress
      );
    } else {
      console.log('❌ Could not find vault address or asset address in deposit option');
      console.log('Vault address:', vaultAddress);
      console.log('Asset address:', assetAddress);
    }
  } else {
    console.log('❌ No deposit options available');
  }
  
  // 3. View user positions
  console.log('\n💼 3. Checking user positions...');
  await getUserPositions();
  
  console.log('\n🎉 === Example Implementation Complete === 🎉');
}

// Run the example implementation
runExampleImplementation().catch(console.error);