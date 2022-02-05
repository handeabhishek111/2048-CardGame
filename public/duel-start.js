$(document).ready(function () {
  setMoralisData();
});

let connection = Moralis.onConnect(function (accounts) {
  setMoralisData();
});

function setMoralisData() {
  let user = Moralis.User.current();
  if (user) {
    $('#nfts-url').css('display', 'block');
    $('#nfts-url').attr(
      'href',
      `https://opensea.io/${user.get('ethAddress')}?tab=private`
    );
    console.log(`${user.get('ethAddress')}`);
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://api.nftport.xyz/v0/accounts/${user.get(
        'ethAddress'
      )}?chain=polygon`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'c00bc5e8-e27e-4e8b-8d4d-15e74a7a84d9',
      },
    };
    const cardDiv = `<div class="card bg-light nft-card col-3 m-2" onclick="setTokenId(this.id)" id="{token_id}">
    <img class="card-img-top" src="{nft-image}" alt="2048 NFT Game">
    <div class="card-body">
        <h5 class="card-title">{nft-title}</h5>
        <p class="card-text">{nft-description}</p>
    </div>
    
    <div class="card-body row">
        <span class="col-6"><strong>Score</strong></span>
        <span class="col-6"><strong>Token ID</strong></span>
        <span class="col-6">{nft-score}</span>
        <span class="col-6">{token_id}</span>
    </div>
</div>`;
    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response && response.nfts) {
        response.nfts.forEach(async (nft) => {
          if (
            nft.contract_address ===
            '0xb9d53af8a1ad9ed52714c53075d8d2124d0729bc'
          ) {
            console.log(nft.contract_address);

            const settings = {
              async: true,
              crossDomain: true,
              url: `https://api.covalenthq.com/v1/137/tokens/0xb9d53af8a1ad9ed52714c53075d8d2124d0729bc/nft_metadata/${nft.token_id}/?quote-currency=USD&format=JSON&key=ckey_66c30cdb41ca4d87a451559d868`,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'c00bc5e8-e27e-4e8b-8d4d-15e74a7a84d9',
              },
            };
            $.ajax(settings).done(function (metadata) {
              console.log(metadata);
              let nftData = metadata.data.items[0].nft_data[0];
              let nftCard = cardDiv
                .replace(/{token_id}/g, nftData.token_id)
                .replace(/{nft-score}/g, nftData.external_data.attributes[1].value)
                .replace(/{nft-title}/g, nftData.external_data.name)
                .replace(/{nft-description}/g, nftData.external_data.description)
                .replace(/{nft-image}/, nftData.external_data.image);
              $(nftCard).appendTo('#outer-div');
            });
          }
        });
      }
      // if (response.transaction_external_url) {
      //   $("#container-card").css("display", "block");
      //   $("#transaction-url").css("display", "block");
      //   $("#transaction-url").attr(
      //     "href",
      //     response.transaction_external_url
      //   );
      // }
    });
  }
}

function setTokenId(tokenId) {
  console.log(tokenId)
  // var t = $(this).attr('tokenId');
  $('#tokenId').val(tokenId);
}

// $('.nft-card').click(function () {
//   var t = $(this).attr('tokenId');
//   console.log(t)
//   $('#tokenId').val(t);
// });

const contractAbi = [
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'bool', name: '_isFreezeTokenUris', type: 'bool' },
      { internalType: 'string', name: '_initBaseURI', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_value',
        type: 'string',
      },
      { indexed: true, internalType: 'uint256', name: '_id', type: 'uint256' },
    ],
    name: 'PermanentURI',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'PermanentURIGlobal', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'freezeAllTokenUris',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'freezeTokenUris',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isFreezeTokenUris',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'caller', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'mintToCaller',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_newBaseURI', type: 'string' },
      { internalType: 'bool', name: '_freezeAllTokenUris', type: 'bool' },
    ],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'string', name: '_tokenUri', type: 'string' },
      { internalType: 'bool', name: '_isFreezeTokenUri', type: 'bool' },
    ],
    name: 'updateTokenUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const web3 = new Moralis.Web3();

const contract_address = '0xB9d53AF8A1aD9eD52714c53075d8D2124d0729BC';
async function startDuel(user) {
  // staking 0.001 Matic
  const options = {
    type: 'native',
    amount: Moralis.Units.ETH('0.001'),
    receiver: '0x934f351E49800ff7d72B63D11D12eA0027e57302', //receiver address for staking the reward money
  };
  let result = await Moralis.transfer(options);
  console.log(result);
  const settings = {
    async: false,
    crossDomain: true,
    url: `/duel/add/${user.get('ethAddress')}/${$('#tokenId').val()}`,
    method: 'get',
    processData: false,
  };

  $.ajax(settings).done(function (response) {
    if (response == true) {
      $('#duel-start-btn').hide();
      $('#result-btn').css('display', 'block');
      alert('Duel Started Please click on the Result button to see the result');
    } else if (response == false) {
      alert('You have been already placed in a queue');
    }
  });
}
async function checkIfOwner() {
  try {
    let user = Moralis.User.current();

    const options = {
      contractAddress: contract_address,
      functionName: 'ownerOf',
      abi: contractAbi,
      params: {
        tokenId: $('#tokenId').val(),
      },
    };

    const ownerAddress = await Moralis.executeFunction(options);
    console.log(ownerAddress.toLowerCase(), user.get('ethAddress'));
    if (ownerAddress.toLowerCase() == user.get('ethAddress')) {
      console.log('OwnerVerified');
      await startDuel(user);
    } else {
      alert('please enter a token ID which is owned by you');
    }
    console.log(ownerAddress);
  } catch (error) {
    console.log(error);
    alert('please enter a valid token ID');
  }
}
document.getElementById('btn-duel').onclick = checkIfOwner;
