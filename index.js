import { getInSkyblock, replaceBazaarMessage, stripRomanNumerals } from './functions.js';
import { getBazaarResponse } from './formatFunctions.js'
import Audio from './audio.js';
import PogObject from '../PogData';

const bzAudio = new Audio();
const BZ_PREFIX = '&6[BZ] '; 
let moduleVersion = JSON.parse(FileLib.read("BetterBZ", "metadata.json")).version;

export const bzData = new PogObject("BetterBZ", {
    "sounds": false,
    "firstInstall": false,
})
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
    let soundStatus = bzData.sounds ? '&aON' : '&cOFF';
    ChatLib.chat(`&6[BetterBZ] &7Loaded! &3[&rSounds: ${soundStatus}&3]`);                      
    if (bzData.firstInstall) {
        if (moduleVersion === '1.0.1') {
            ChatLib.chat(`&e&lNEW Features: (v1.0.1)`);
            ChatLib.chat(`o &rDo &b/bzsounds &rto turn ding sounds on/off`)
            ChatLib.chat(`&7Note: These sounds are only available for 'sell offer/buy order filled'!`)
        }
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
    let instabuyMessage = ultimateBooks.includes(stripRomanNumerals(item).trim()) 
        ? getBazaarResponse(BZ_PREFIX, message, 'instabuyUlt')
        : getBazaarResponse(BZ_PREFIX, message, 'instabuyGeneral');
    replaceBazaarMessage(event, instabuyMessage);
}).setCriteria('[Bazaar] Bought ${amt}x ${item} for ${cost} coins!');

//! bz sold instant
register('chat', (amt, item, cost, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    let instasellMessage = ultimateBooks.includes(stripRomanNumerals(item).trim()) 
        ? getBazaarResponse(BZ_PREFIX, message, 'instasellUlt') 
        : getBazaarResponse(BZ_PREFIX, message, 'instasellGeneral');
    replaceBazaarMessage(event, instasellMessage); 
}).setCriteria('[Bazaar] Sold ${amt}x ${item} for ${cost} coins!');

//! bz buy order setup
register('chat', (amt, item, coinsAmt, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    let buyorderSetupMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderSetup');
    replaceBazaarMessage(event, buyorderSetupMessage);
}).setCriteria('[Bazaar] Buy Order Setup! ${amt}x ${item} for ${coinsAmt} coins.');

//! bz buy order filled
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    let buyorderFilledMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderFilled');
    replaceBazaarMessage(event, buyorderFilledMessage);
    if (bzData.sounds) bzAudio.playDingSound();
}).setCriteria('[Bazaar] Your Buy Order for ${amt}x ${item} was filled!');

//! bz buy order claimed    
register('chat', (amt, item, cost, costEach, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    let buyorderClaimedMessage = getBazaarResponse(BZ_PREFIX, message, 'buyOrderClaimed');      
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
    let sellofferSetupMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferSetup');
    replaceBazaarMessage(event, sellofferSetupMessage);
}).setCriteria('[Bazaar] Sell Offer Setup! ${amt}x ${item} for ${cost} coins.');

//! bz sell offer filled
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);    
    let sellofferFilledMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferFilled')
    replaceBazaarMessage(event, sellofferFilledMessage);
    if (bzData.sounds) bzAudio.playDingSound();
}).setCriteria('[Bazaar] Your Sell Offer for ${amt}x ${item} was filled!');   

//! bz sell order claimed  
register('chat', (cost, amt, item, costEach, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);   
    let sellorderClaimedMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferClaimed');        
    replaceBazaarMessage(event, sellorderClaimedMessage);
}).setCriteria('[Bazaar] Claimed ${cost} coins from selling ${amt}x ${item} at ${costEach} each!');

//! bz cancelled sell offer
register('chat', (amt, item, event) => {
    if (!getInSkyblock()) return;
    const message = ChatLib.getChatMessage(event, true);
    let sellofferCancelledMessage = getBazaarResponse(BZ_PREFIX, message, 'sellOfferCancelled');
    replaceBazaarMessage(event, sellofferCancelledMessage);
}).setCriteria('[Bazaar] Cancelled! Refunded ${amt}x ${item} from cancelling Sell Offer!');

//! bz server too laggy
register('chat', (event) => {
    if (!getInSkyblock()) return;
    replaceBazaarMessage(event, `${BZ_PREFIX}&cServer is too laggy to use the Bazaar.`);
}).setCriteria('[Bazaar] This server is too laggy to use the Bazaar, sorry!');