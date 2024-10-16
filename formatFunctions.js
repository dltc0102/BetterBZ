import { abbreviateWords, truncateNumbers } from './functions';

function generateMessage(prefix, message, regex, formatHandler) {
    const match = message.match(regex);
    if (match) {
        return formatHandler(prefix, match);    
    } else {        
        console.log(`matched: false`);
        console.log(`formatHandler: ${formatHandler}`);
        console.log(`message: ${message}`);
        console.log(`regex: ${regex}`);
        console.log(' ');
        return 'not matched -- bz';
    }
}

export function getBazaarResponse(prefix, message, type) {
    const patterns = {
        // template: {
        //     regex: /./,
        //     format: formatFunc,
        // },
        instabuyUlt: {
            regex: /&r&6\[Bazaar\] &r&7Bought &r&a(.+?)&r&7x &r(&[a-z\d+])&l(.+?) &r&7for &r&6(.+?) coins&r&7!&r/,
            format: formatInstabuyUlt
        },
        instabuyGeneral: {
            regex: /&r&6\[Bazaar\] &r&7Bought &r&a(.+?)&r&7x &r(&[a-z\d+])(.+?) &r&7for &r&6(.+?) coins&r&7!&r/,
            format: formatInstabuyGeneral
        },  
        instasellUlt: {
            regex: /&r&6\[Bazaar\] &r&7Sold &r&a(.+)&r&7x &r(&[a-z\d+])&l(.+) &r&7for &r&6(.+) coins&r&7!&r/,
            format: formatInstasellUlt
        },
        instasellGeneral: {
            regex: /&r&6\[Bazaar\] &r&7Sold &r&a(.+)&r&7x &r(&[a-z\d+])(.+) &r&7for &r&6(.+) coins&r&7!&r/,
            format: formatInstasellGeneral
        },
        buyOrderSetup: {    
            regex: /&r&6\[Bazaar\] &r&7&r&eBuy Order Setup! &r&a(.+?)&r&7x &r(&[a-z\d+])(.+?) &r&7for &r&6(.+?) coins&r&7\.&r/,
            format: formatBuyOrderSetup
        },  
        buyOrderFilled: {
            regex: /&6\[Bazaar\] &eYour &aBuy Order &efor &a(.+?)&7x (&[a-z\d+])(.+?) &ewas filled!&r/,
            format: formatBuyOrderFilled
        },
        buyOrderClaimed: {
            regex: /&r&6\[Bazaar\] &r&7&r&7Claimed &r&a(.+?)&r&7x &r(&[a-z\d+])(.+) &r&7worth &r&6(.+) coins &r&7bought for &r&6(.+) &r&7each!&r/,
            format: formatBuyOrderClaimed
        },
        sellOfferSetup: {
            regex: /&r&6\[Bazaar\] &r&7&r&eSell Offer Setup! &r&a(.+?)&r&7x &r(&[a-z\d+])(.+) &r&7for &r&6(.+) coins&r&7\.&r/,
            format: formatSellOfferSetup
        },
        sellOfferFilled: {  
            regex: /&6\[Bazaar\] &eYour &6Sell Offer &efor &a(.+)&7x (&[a-z\d+])(.+) &ewas filled!&r/,      
            format: formatSellOfferFilled
        },
        sellOfferClaimed: {
            regex: /&r&6\[Bazaar\] &r&7&r&7Claimed &r&6(.+?) coins &r&7from selling &r&a(.+?)&r&7x &r(&[a-z\d+])(.+?) &r&7at &r&6(.+?) &r&7each!&r/,
            format: formatSellOfferClaimed
        },
        sellOfferCancelled: {
            regex: /&r&6\[Bazaar\] &r&7&r&cCancelled! &r&7Refunded &r&a(.+?)&r&7x &r(&[a-z\d+])(.+) &r&7from cancelling Sell Offer!&r/,
            format: formatSellOfferCancelled
        },
    };

    const { regex, format } = patterns[type];
    return generateMessage(prefix, message, regex, format);
}   

function formatInstabuyUlt(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost] = match;
    return `${prefix}Insta-bought: &a${itemAmount}&7x ${itemColor}&l${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`;
}

function formatInstabuyGeneral(prefix, match) {     
    let [_, itemAmount, itemColor, itemName, itemCost] = match;
    return `${prefix}Insta-bought: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`;    
}

function formatInstasellUlt(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost] = match;
    return `${prefix}Insta-sold: &a${itemAmount}&7x ${itemColor}&l${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`;
}

function formatInstasellGeneral(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost] = match;
    return `${prefix}Insta-sold: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`;
}

function getCostPerItem(amt, cost) {
    let floatAmt = parseFloat(amt.replace(/,/g, ''));
    let floatCost = parseFloat(cost.replace(/,/g, ''))
    return truncateNumbers((floatCost / floatAmt).toFixed(2));
}

function formatBuyOrderSetup(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost] = match; 
    let costPer = getCostPerItem(itemAmount, itemCost);   
    return itemAmount === '1' 
        ? `${prefix}Buy Order Set: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`
        : `${prefix}Buy Order Set: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)} &7(${costPer} per)!`;               
}

function formatBuyOrderFilled(prefix, match) {
    let [_, itemAmt, itemColor, itemName] = match;
    return `${prefix}Buy Order Filled: &a${itemAmt}&7x ${itemColor}${abbreviateWords(itemName)}&7!`;
}       

function formatBuyOrderClaimed(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost, eachCost] = match;
    let [__, bold=null, name] = itemName.match(/(&[a-qs-z0-9])?(.+)/);
    let finalItemName = bold ? `${bold}${abbreviateWords(name)}` : abbreviateWords(name);       
    return itemAmount === '1' 
        ? `${prefix}Buy Order Claimed: &a${itemAmount}&7x ${itemColor}${finalItemName} &7for &6${truncateNumbers(itemCost)}&7!`
        : `${prefix}Buy Order Claimed: &a${itemAmount}&7x ${itemColor}${finalItemName} &7for &6${truncateNumbers(itemCost)} &7(${truncateNumbers(eachCost)} per)!`;
}

function formatSellOfferSetup(prefix, match) {
    let [_, itemAmount, itemColor, itemName, itemCost] = match;
    return `${prefix}Sell Offer Set: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`;
}

function formatSellOfferFilled(prefix, match) {
    let [_, itemAmount, itemColor, itemName] = match;
    return `${prefix}Sell Offer Filled: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)}&7!`;
}

function formatSellOfferClaimed(prefix, match) {
    let [_, itemCost, itemAmount, itemColor, itemName, eachCost] = match;
    return itemAmount === '1' 
        ? `${prefix}Sell Offer Claimed: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)}&7!`
        : `${prefix}Sell Offer Claimed: &a${itemAmount}&7x ${itemColor}${abbreviateWords(itemName)} &7for &6${truncateNumbers(itemCost)} &7(${truncateNumbers(eachCost)} per)!`;
}   

function formatSellOfferCancelled(prefix, match) {
    let [_, itemAmount, itemColor, itemName] = match;
    return `${prefix}&r&6Sell Offer Cancelled: &a${itemAmount}&7x ${itemColor}${itemName}`;     
}
