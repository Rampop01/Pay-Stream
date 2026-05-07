import { 
  openContractCall, 
  ContractCallUint64, 
  ContractCallStringUtf8, 
  ContractCallList,
  ContractCallPrincipal
} from '@stacks/connect';
import { 
  AnchorMode, 
  PostConditionMode, 
  uintCV, 
  stringUtf8CV, 
  listCV, 
  principalCV,
  Pc
} from '@stacks/transactions';

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Default dev address
const CONTRACT_NAME = 'content-hub';

export async function registerContentContract({
  title,
  description,
  category,
  price,
  onFinish,
  onCancel
}: {
  title: string;
  description: string;
  category: string;
  price: number;
  onFinish: (data: any) => void;
  onCancel: () => void;
}) {
  const network = 'testnet';
  
  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'register-content',
    functionArgs: [
      stringUtf8CV(title),
      stringUtf8CV(description),
      stringUtf8CV(category),
      uintCV(price)
    ],
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel
  });
}

export async function unlockContentContract({
  creatorAddress,
  senderAddress,
  amountInSTX,
  onFinish,
  onCancel
}: {
  creatorAddress: string;
  senderAddress: string;
  amountInSTX: number;
  onFinish: (data: any) => void;
  onCancel: () => void;
}) {
  const network = 'testnet';
  const amountInMicrostacks = amountInSTX * 1000000;

  // Post condition to ensure STX are transferred
  const postCondition = Pc.principal(senderAddress).willSendEq(amountInMicrostacks).ustx();

  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'unlock-content',
    functionArgs: [
      principalCV(creatorAddress)
    ],
    postConditions: [postCondition],
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel
  });
}
