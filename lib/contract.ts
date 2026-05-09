import { StacksMainnet } from '@stacks/network';

const CONTRACT_ADDRESS = 'SP1BTBG1TW13NEV2FQM7HC1BZ9XZV7FZSGPMVV38M'; // Deployed Mainnet address
const CONTRACT_NAME = 'content_hub';

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
  const { openContractCall } = await import('@stacks/connect');
  const { AnchorMode, stringUtf8CV, uintCV } = await import('@stacks/transactions');
  const network = new StacksMainnet();
  
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
  const { openContractCall } = await import('@stacks/connect');
  const { AnchorMode, PostConditionMode, principalCV, Pc } = await import('@stacks/transactions');
  const network = new StacksMainnet();
  const amountInMicrostacks = BigInt(Math.round(amountInSTX * 1000000));

  console.log(`[Contract] Unlocking content from ${creatorAddress} for ${amountInMicrostacks} microSTX`);

  // Post condition to ensure STX are transferred
  const postCondition = Pc.principal(senderAddress).willSendEq(amountInMicrostacks).ustx();

  try {
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
  } catch (error) {
    console.error('Contract call error:', error);
    throw error;
  }
}
