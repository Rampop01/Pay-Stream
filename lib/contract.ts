import { StacksMainnet } from '@stacks/network';
import { toast } from 'sonner';

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
  const priceInMicrostacks = BigInt(price);

  console.log(`[Contract] Registering content: "${title}" for ${priceInMicrostacks} microSTX`);
  
  await openContractCall({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'register-content',
    functionArgs: [
      stringUtf8CV(title),
      stringUtf8CV(description),
      stringUtf8CV(category),
      uintCV(priceInMicrostacks)
    ],
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel
  });
}

export async function getOnChainPrice(creatorAddress: string): Promise<bigint | null> {
  try {
    const { fetchCallReadOnlyFunction, standardPrincipalCV, cvToJSON } = await import('@stacks/transactions');
    const network = new StacksMainnet();
    
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-content-metadata',
      functionArgs: [standardPrincipalCV(creatorAddress)],
      senderAddress: CONTRACT_ADDRESS,
    });

    const json = cvToJSON(result);
    if (json && json.value && json.value.value && json.value.value.price) {
      return BigInt(json.value.value.price.value);
    }
    return null;
  } catch (error) {
    console.error('[Contract] Error fetching on-chain price:', error);
    return null;
  }
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
  
  console.log(`[Contract] Starting unlock flow: Creator=${creatorAddress}, Sender=${senderAddress}`);

  // Prevent self-unlocking if it causes issues (though Clarity allows it, it's redundant)
  if (creatorAddress === senderAddress) {
    toast.error("You cannot unlock your own content.");
    onCancel();
    return;
  }

  // Verify on-chain first
  const onChainPrice = await getOnChainPrice(creatorAddress);
  if (onChainPrice === null) {
    toast.error("Creator not found on-chain. Did they register properly?");
    console.error(`[Contract] Creator ${creatorAddress} not found in content-metadata map.`);
    onCancel();
    return;
  }

  const amountInMicrostacks = onChainPrice;
  console.log(`[Contract] Verified On-chain price: ${amountInMicrostacks} microSTX`);

  // Post condition to ensure STX are transferred
  // Using willSendEq to be strict. If this fails, the price in the contract changed.
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
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
      onFinish,
      onCancel
    });
  } catch (error) {
    console.error('[Contract] Contract call exception:', error);
    toast.error("Transaction failed to initialize.");
    throw error;
  }
}
