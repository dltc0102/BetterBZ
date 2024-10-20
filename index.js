import { getInSkyblock, replaceBazaarMessage, stripRomanNumerals, truncateNumbers } from './functions.js';
import { getBazaarResponse } from './formatFunctions.js'
import Audio from './audio.js';
import PogObject from '../PogData';

const bzAudio = new Audio();
const BZ_PREFIX = '&6[BZ] '; 
const moduleVersion = JSON.parse(FileLib.read("BetterBZ", "metadata.json")).version;
const supportLink = 'https://discord.gg/gGd6RD5Z';
const supportClickable = new TextComponent('&c&l[REPORT ERRORS HERE]')
    .setClick('open_url', supportLink)
    .setHover('show_text', supportLink);

export const bzData = new PogObject("BetterBZ", {
    "sounds": false,
    "firstInstall": false,
});
bzData.autosave(5);

register('command', () => {
    if (!bzData.sounds) {
        bzData.sounds = true;
        ChatLib.chat(`&6[BetterBZ] &rSounds: &aON`);
    } else if (bzData.sounds) {
        bzData.sounds = false;
        ChatLib.chat(`&6[BetterBZ] &rSounds: &cOFF`);
    }
}).setName('bzsounds');

register('gameLoad', () => {
    const soundStatus = bzData.sounds ? '&aON' : '&cOFF';
    const bzLoadMessage = `&6[BetterBZ] &7Loaded! &3[&rSounds: ${soundStatus}&3]`;
    const suppportMessage = new Message (
        `${bzLoadMessage} &r&8-- `, supportClickable
    );
    
    ChatLib.chat(suppportMessage);
    if (bzData.firstInstall) { 
        bzData.firstInstall = false;
    }
});


const bzProcessMessages = [
    /\[Bazaar] Executing instant sell\.\.\./, 
    /\[Bazaar] Executing instant buy\.\.\./,
    /\[Bazaar] Putting goods in escrow\.\.\./,  
    /\[Bazaar] Submitting buy order\.\.\./, 
    /\[Bazaar] Claiming order\.\.\./,   
    /\[Bazaar] Cancelling order\.\.\./,
    /\[Bazaar] Submitting sell offer\.\.\./,
    /\[Bazaar] You don't have enough products!/,
    /\[Bazaar] The Buy Orders for this item changed too much!/,
]

bzProcessMessages.forEach(msg => {
    register('chat', (event) => {
        if (!getInSkyblock()) return;
        cancel(event);
    }).setCriteria(msg);
});

const ultimateBooks = ['Chimera', 'Habenero Tactics', 'The One', 'Fatal Tempo', "Bobbin' Time", 'Inferno', 'Flash', 'Duplex', 'Rend', 'Refrigerate', 'Legion', 'One For All', 'Soul Eater', 'Swarm', 'Last Stand', 'Wisdom', 'Ultimate Wise', 'Ultimate Jerry', 'Combo', 'Bank', 'No Pain No Gain'];

//! bz bought instant                       
register('chat', (amt, item, cost, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const instabuyMessage = ultimateBooks.includes(stripRomanNumerals(item).trim()) 
        ? getBazaarResponse(BZ_PREFIX, message, 'instabuyUlt')
        : getBazaarResponse(BZ_PREFIX, message, 'instabuyGeneral');
    replaceBazaarMessage(event, instabuyMessage);
}).setCriteria('[Bazaar] Bought ${amt}x ${item} for ${cost} coins!');

//! bz sold instant
register('chat', (amt, item, cost, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const instasellMessage = ultimateBooks.includes(stripRomanNumerals(item).trim()) 
        ? getBazaarResponse(BZ_PREFIX, message, 'instasellUlt') 
        : getBazaarResponse(BZ_PREFIX, message, 'instasellGeneral');
    replaceBazaarMessage(event, instasellMessage); 
}).setCriteria('[Bazaar] Sold ${amt}x ${item} for ${cost} coins!');

//! bz buy order setup
register('chat', (amt, item, coinsAmt, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const buyorderSetupMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderSetup');
    replaceBazaarMessage(event, buyorderSetupMessage);
}).setCriteria('[Bazaar] Buy Order Setup! ${amt}x ${item} for ${coinsAmt} coins.');

//! bz buy order filled
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const buyorderFilledMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderFilled');
    replaceBazaarMessage(event, buyorderFilledMessage);
    if (bzData.sounds) bzAudio.playDingSound();
}).setCriteria('[Bazaar] Your Buy Order for ${amt}x ${item} was filled!');

//! bz buy order claimed    
register('chat', (amt, item, cost, costEach, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const buyorderClaimedMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderClaimed');      
    replaceBazaarMessage(event, buyorderClaimedMessage);
}).setCriteria('[Bazaar] Claimed ${amt}x ${item} worth ${cost} coins bought for ${costEach} each!');

//! bz cancelled buy order              
register('chat', (cost, event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&r&6Buy Order Cancelled: &7Refunded &r&6${cost} coins&7!`);
}).setCriteria('[Bazaar] Cancelled! Refunded ${cost} coins from cancelling Buy Order!');


//! bz sell offer setup
register('chat', (amt, item, cost, event) =>  {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const sellofferSetupMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferSetup');
    replaceBazaarMessage(event, sellofferSetupMessage);
}).setCriteria('[Bazaar] Sell Offer Setup! ${amt}x ${item} for ${cost} coins.');

//! bz sell offer filled
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);    
    const sellofferFilledMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferFilled')
    replaceBazaarMessage(event, sellofferFilledMessage);
    if (bzData.sounds) bzAudio.playDingSound();
}).setCriteria('[Bazaar] Your Sell Offer for ${amt}x ${item} was filled!');   

//! bz sell order claimed  
register('chat', (cost, amt, item, costEach, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);   
    const sellorderClaimedMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferClaimed');        
    replaceBazaarMessage(event, sellorderClaimedMessage);
}).setCriteria('[Bazaar] Claimed ${cost} coins from selling ${amt}x ${item} at ${costEach} each!');

//! bz cancelled sell offer
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const sellofferCancelledMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferCancelled');
    replaceBazaarMessage(event, sellofferCancelledMessage);
}).setCriteria('[Bazaar] Cancelled! Refunded ${amt}x ${item} from cancelling Sell Offer!');

//! bz server too laggy
register('chat', (event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cServer is too laggy to use the Bazaar.`);
}).setCriteria('[Bazaar] This server is too laggy to use the Bazaar, sorry!');

//! volatile market
register('chat', (event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cThis item has a volatile market!`)
}).setCriteria('[Bazaar] Seems like a volatile market!');

//! escrow refund
//TODO: check
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    if (message.includes('Auction')) return;    
    const getRefundedMessage = getBazaarResponse(BZ_PREFIX, message, 'escrowRefund');
    replaceBazaarMessage(event, getRefundedMessage);
}).setCriteria('Escrow refunded ${amt} ${item}!');

//! bazaar flipped
register('chat', (amt, item, profit, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    const bzFlipMessage = getBazaarResponse(BZ_PREFIX, message, 'bzFlip');
    replaceBazaarMessage(event, bzFlipMessage);
}).setCriteria('[Bazaar] Order Flipped! ${amt}x ${item} for ${profit} coins of total expected profit.');

//! no buyers
register('chat', (item, event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cNo buyers for &e${item}!`);        
}).setCriteria("[Bazaar] Couldn't find any buyers for ${item}!");

//! have goods!
register('chat', (event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cYou have goods to claim on this order!`);        
}).setCriteria('[Bazaar] You have goods to claim on this order!');

//! price is lower than expected
register('chat', (inputPrice, oldPrice, event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cERROR: &6${truncateNumbers(inputPrice)}/unit &7is too &clow&7! &7(Ask: &6${truncateNumbers(oldPrice)}/unit&7)`);  
}).setCriteria('[Bazaar] This price of ${inputPrice}/unit is lower than the old price of ${oldPrice}/unit!');       

const bzErrorTypes = {
    "Your price is way over the best order/offer's price.": "Price exceeds the best order/offer.",
    "This price doesn't work.": "Price doesn't work",
    "You don't have the space required to claim that!": "Inventory has no space to claim!",
    "You cannot afford this!": "Insufficient Funds!",
    "Couldn't parse that price!": "Unrecognized price format!",
    "You are overbidding too much!": "Too much overbid!",
}

register('chat', (response, event) => {
    if (!getInSkyblock()) return;
    if (bzErrorTypes.hasOwnProperty(response)) {
        replaceBazaarMessage(event, `${BZ_PREFIX}&c${bzErrorTypes[response]}`);     
    }
}).setCriteria('[Bazaar] ${response}'); 

//! allowed unit price
register('chat', (cost, event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}Max allowed: &r${truncateNumbers(cost, true)}`);                 
}).setCriteria('[Bazaar] Allowed unit price: ${cost} coins');

