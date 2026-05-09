const { makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode, uintCV, cvToJSON, fetchCallReadOnlyFunction, standardPrincipalCV, stringUtf8CV, Pc } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

const NETWORK = STACKS_MAINNET;
const CONTRACT_ADDRESS = 'SP1BTBG1TW13NEV2FQM7HC1BZ9XZV7FZSGPMVV38M';
const CONTRACT_NAME = 'content_hub';

// Load bot wallets from StacksDuel fleet
const BOTS_PATH = '/Users/a/Desktop/StacksDuel/backend/.bot/bot-fleet.json';
let BOTS = [];

try {
    BOTS = JSON.parse(fs.readFileSync(BOTS_PATH, 'utf8'));
    console.log(`✅ Loaded ${BOTS.length} bots from StacksDuel fleet.`);
} catch (e) {
    console.error('❌ Failed to load bot fleet:', e.message);
    process.exit(1);
}

// --- State Tracking ---
// Track registered content creators so bots can unlock them
const registeredCreators = []; // array of bot indices

const CONTENT_TOPICS = [
    { title: "Advanced Clarity Smart Contracts", desc: "Learn the deepest secrets of Clarity.", category: "Education" },
    { title: "Bitcoin Ecosystem Deep Dive", desc: "A comprehensive guide to building on Bitcoin.", category: "Education" },
    { title: "Web3 Development Masterclass", desc: "From zero to hero in Web3.", category: "Education" },
    { title: "Cyberpunk Digital Art Collection", desc: "Exclusive high-res cyberpunk artworks.", category: "Art" },
    { title: "Lo-Fi Coding Beats Vol 1", desc: "Relaxing beats to code smart contracts to.", category: "Music" },
    { title: "Stacks Nakamoto Upgrade Explained", desc: "Everything you need to know about the Nakamoto release.", category: "Video" },
    { title: "Exclusive Tech Podcast", desc: "Interviews with top Web3 founders.", category: "Other" },
    { title: "Decentralized Finance Strategies", desc: "How to maximize yield in DeFi.", category: "Education" }
];

// --- Helpers ---
async function broadcastTx(txOptions) {
    try {
        const transaction = await makeContractCall(txOptions);
        const response = await broadcastTransaction({ transaction, network: NETWORK });
        if (response.error) {
            console.log(`   ❌ TX Error: ${response.error} | ${response.reason}`);
            return null;
        }
        console.log(`   ✅ TX Sent: ${response.txid}`);
        return response.txid;
    } catch (e) {
        console.log(`   ❌ TX Exception: ${e.message}`);
        return null;
    }
}

// --- Actions ---

// ACTION 1: Register Content
async function doRegisterContent(bot, botIndex) {
    // If this bot already registered, skip or update? Let's just update.
    const topic = CONTENT_TOPICS[Math.floor(Math.random() * CONTENT_TOPICS.length)];
    const priceSTX = 1 + Math.floor(Math.random() * 5); // 1 to 5 STX
    const priceMicroSTX = priceSTX * 1000000;

    console.log(`🎬 [${ts()}] Bot #${botIndex} (${truncate(bot.address)}) -> REGISTER CONTENT: "${topic.title}" for ${priceSTX} STX`);

    const txid = await broadcastTx({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-content',
        functionArgs: [
            stringUtf8CV(topic.title),
            stringUtf8CV(topic.desc),
            stringUtf8CV(topic.category),
            uintCV(priceMicroSTX)
        ],
        senderKey: bot.privateKey,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: 3000n
    });

    if (txid && !registeredCreators.includes(botIndex)) {
        registeredCreators.push(botIndex);
    }
}

// ACTION 2: Unlock Content
async function doUnlockContent(bot, botIndex) {
    if (registeredCreators.length === 0) {
        console.log(`   ⏸️ No content registered yet to unlock.`);
        return;
    }

    // Pick a random creator (ensure it's not the buyer themselves)
    let creatorIndex = registeredCreators[Math.floor(Math.random() * registeredCreators.length)];
    if (creatorIndex === botIndex && registeredCreators.length > 1) {
        // Try to pick someone else
        creatorIndex = registeredCreators.find(idx => idx !== botIndex);
    }
    
    if (creatorIndex === botIndex) {
        return; // Can't buy own content if nobody else exists
    }

    const creatorBot = BOTS[creatorIndex];
    
    // Query the price first
    let priceMicroSTX = 1000000; // default fallback
    try {
        const result = await fetchCallReadOnlyFunction({
            network: NETWORK,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-content-metadata',
            functionArgs: [standardPrincipalCV(creatorBot.address)],
            senderAddress: CONTRACT_ADDRESS,
        });
        const json = cvToJSON(result);
        if (json.value && json.value.value) {
            priceMicroSTX = Number(json.value.value.price.value);
        } else {
            console.log(`   ⏸️ Content metadata not found for creator ${creatorBot.address}.`);
            return;
        }
    } catch (e) {
        console.error('❌ Error fetching content metadata:', e.message);
        return;
    }

    console.log(`🔓 [${ts()}] Bot #${botIndex} (${truncate(bot.address)}) -> UNLOCK CONTENT from Bot #${creatorIndex} (${truncate(creatorBot.address)}) for ${priceMicroSTX / 1000000} STX`);

    const postCondition = Pc.principal(bot.address).willSendEq(priceMicroSTX).ustx();

    const txid = await broadcastTx({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'unlock-content',
        functionArgs: [
            standardPrincipalCV(creatorBot.address)
        ],
        senderKey: bot.privateKey,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditions: [postCondition],
        postConditionMode: PostConditionMode.Deny,
        fee: 50000n
    });
}

// --- Utilities ---
function ts() { return new Date().toLocaleTimeString(); }
function truncate(addr) { return `${addr.slice(0, 5)}...${addr.slice(-4)}`; }

// --- Main Loop ---
async function performRandomActivity() {
    const botIndex = Math.floor(Math.random() * BOTS.length);
    const bot = BOTS[botIndex];

    try {
        console.log(`\n📊 State: ${registeredCreators.length} creators registered`);

        // If no content, force register
        if (registeredCreators.length < 2) {
            await doRegisterContent(bot, botIndex);
        } else {
            // Weighted action selection
            const roll = Math.random();

            if (roll < 0.30) {
                // 30%: Register or update content
                await doRegisterContent(bot, botIndex);
            } else {
                // 70%: Unlock someone's content
                await doUnlockContent(bot, botIndex);
            }
        }
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
    }

    scheduleNext();
}

function scheduleNext() {
    let nextSecs;
    const pattern = Math.random();

    if (pattern < 0.1) {
        // 10%: Long break (8-15 min) — user went AFK
        nextSecs = 480 + Math.floor(Math.random() * 420);
    } else if (pattern < 0.3) {
        // 20%: Medium pause (3-7 min) — browsing/thinking
        nextSecs = 180 + Math.floor(Math.random() * 240);
    } else {
        // 70%: Normal gap (1.5-3 min) — active user
        nextSecs = 90 + Math.floor(Math.random() * 90);
    }

    const mins = (nextSecs / 60).toFixed(1);
    console.log(`⏳ Next action in ${mins} minutes`);
    setTimeout(performRandomActivity, nextSecs * 1000);
}

console.log("🔥 ContentStream BOT FLEET: FULL LIFECYCLE MODE");
console.log("===============================================");
console.log("Actions: register-content | unlock-content");
console.log("");
performRandomActivity();
