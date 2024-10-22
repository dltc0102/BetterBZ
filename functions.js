export function showAlert(someTitle) {
    Client.showTitle(someTitle, '', 1, 30, 1);
}

export function stripRank(name) {
    const rankNameRegex = /\[(?:MVP\+\+|MVP\+|MVP|VIP\+|VIP)\] (\S+)/;
    const nameMatch = name.match(rankNameRegex);
    return nameMatch ? nameMatch[1] : name.trim();
}

export function abbreviateWords(name) {
    let newName = name;
    if (name.includes('Enchanted')) {
        newName = name.replace(/Enchanted/g, 'Ench.');
    }
    return newName.removeFormatting();
}

export function truncateNumbers(amt, isCoins=false) { 
    const cost = Number(amt.toString().replace(/,/g, '').replace('-', ''));
    const formatNumber = (num) => {
        const fixedNum = num.toFixed(2);
        return fixedNum.endsWith('.00') ? num.toFixed(0) : fixedNum;
    };

    switch (true) {
        case cost >= 1_000_000_000_000:
            return formatNumber(cost / 1_000_000_000_000) + 'T';
        case cost >= 1_000_000_000:
            return formatNumber(cost / 1_000_000_000) + 'B';
        case cost >= 1_000_000:
            return formatNumber(cost / 1_000_000) + 'M';
        case cost >= 1_000:
            return formatNumber(cost / 1_000) + 'K';
        case cost !== 1 && cost < 1_000:
            return isCoins 
                ? `${cost.toFixed(1).toString()} coins` 
                : cost.toFixed(1).toString();
        default:    
            return isCoins 
                ? `${cost.toFixed(1).toString()} coin` 
                : cost.toFixed(1).toString();
    }
};

export function stripRomanNumerals(name) {
    return name
        .replace(/I/g, '')
        .replace(/V/g, '');
}

export function getInSkyblock() {
    if (!World.isLoaded()) return false;
    return ChatLib.removeFormatting(Scoreboard.getTitle()).includes("SKYBLOCK");
}

export function getCurrArea() {
    if (!getInSkyblock()) return;
    let rawArea = '';
    TabList.getNames().forEach(line => {
        let fLine = line.removeFormatting();
        let areaMatch = fLine.match(/Area: (.+)/);
        if (areaMatch) rawArea = areaMatch[1];
    });
    return rawArea;
}

export function getInHub() {
    return getCurrArea() === 'Hub';
}

export function replaceBazaarMessage(event, message, bypass=false) {
    cancel(event);

    if (Array.isArray(message)) {
        message.forEach(msg => {
            if (!bypass) ChatLib.chat(msg);
            if (bypass) msg.chat();
        });
    } else {
        if (!bypass) ChatLib.chat(message);
        if (bypass) message.chat();
    };
};

export function createClickable(fullMessage, linkMessage) {
    const titleMessage = `${fullMessage.trim()}&r&7! `;
    const linkObject = new TextComponent("&6&l[CLICK]").setClick("run_command", linkMessage);
    return new Message (
        titleMessage,
        linkObject 
    )
}   

register('command', () => {
    ChatLib.simulateChat('&r&6[Bazaar] &r&7Bought &r&a1&r&7x &r&6Recombobulator 3000 &r&7for &r&69,076,286 coins&r&7!&r')
    ChatLib.simulateChat('&r&6[Bazaar] &r&7Bought &r&a1&r&7x &r&d&lLast Stand I &r&7for &r&6214,957 coins&r&7!&r')

    ChatLib.simulateChat(`&r&6[Bazaar] &r&7Sold &r&a1&r&7x &r&5Diamante's Handle &r&7for &r&61,099,936 coins&r&7!&r`)
    ChatLib.simulateChat(`&r&6[Bazaar] &r&7Sold &r&a1&r&7x &r&d&lLast Stand I &r&7for &r&6169,632 coins&r&7!&r`)

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eBuy Order Setup! &r&a1&r&7x &r&aEnchanted Snow Block &r&7for &r&6563.7 coins&r&7.&r')    
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eBuy Order Setup! &r&a1,024&r&7x &r&aEnchanted Snow Block &r&7for &r&6577,229 coins&r&7.&r')

    ChatLib.simulateChat('&6[Bazaar] &eYour &aBuy Order &efor &a64&7x &aEnchanted Snow Block &ewas filled!&r')
    ChatLib.simulateChat('&6[Bazaar] &eYour &aBuy Order &efor &a1&7x &aEnchanted Snow Block &ewas filled!&r')

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&7Claimed &r&a160&r&7x &r&aEnchanted Snow Block &r&7worth &r&690,768 coins &r&7bought for &r&6567.3 &r&7each!&r')  
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&7Claimed &r&a1&r&7x &r&aEnchanted Snow Block &r&7worth &r&6563.6 coins &r&7bought for &r&6563.6 &r&7each!&r')  

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eSell Offer Setup! &r&a64&r&7x &r&aEnchanted Snow Block &r&7for &r&636,426 coins&r&7.&r')
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eSell Offer Setup! &r&a1&r&7x &r&aEnchanted Snow Block &r&7for &r&6569.2 coins&r&7.&r')

    ChatLib.simulateChat('&6[Bazaar] &eYour &6Sell Offer &efor &a1&7x &aEnchanted Snow Block &ewas filled!&r')
    ChatLib.simulateChat('&6[Bazaar] &eYour &6Sell Offer &efor &a64&7x &aEnchanted Snow Block &ewas filled!&r')

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&7Claimed &r&6571.1 coins &r&7from selling &r&a1&r&7x &r&aEnchanted Snow Block &r&7at &r&6576.9 &r&7each!&r');
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&7Claimed &r&636,673 coins &r&7from selling &r&a64&r&7x &r&aEnchanted Snow Block &r&7at &r&6578.8 &r&7each!&r');

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&cCancelled! &r&7Refunded &r&a1&r&7x &r&5Second Master Star &r&7from cancelling Sell Offer!&r')

    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&cCancelled! &r&7Refunded &r&6512.0 coins &r&7from cancelling Buy Order!&r')
}).setName('checkbz_consistency');  

register('command', () => {
    //* bazaar flipped positive
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eOrder Flipped! &r&a3&r&7x Carrot &r&7for &r&65.4 coins &r&7of total expected profit.&r')

    //! bazaar flipped negative
    ChatLib.simulateChat('&r&6[Bazaar] &r&7&r&eOrder Flipped! &r&a2,095&r&7x Carrot &r&7for &r&6-3,715.0 coins &r&7of total expected profit.&r');

    //* volatile market (not accurate)
    ChatLib.simulateChat('&r&6[Bazaar] &cSeems like a volatile market!&r')

    //* escrow refunded (not accurate)    
    ChatLib.simulateChat('&eEscrow refunded 20,160 Melon!');

    //* price of input/unit is lower than oldinput/unit
    ChatLib.simulateChat('&r&6[Bazaar] &r&c&r&cThis price of &r&61.0&r&c/unit is lower than the old price of &r&6550.8&r&c/unit!&r')
    
    //* you have goods to claim
    ChatLib.simulateChat('&r&6[Bazaar] &r&c&r&cYou have goods to claim on this order!&r')

    //* you dont have space required to claim that
    ChatLib.simulateChat("&r&6[Bazaar] &r&cYou don't have the space required to claim that!&r")

    //* price doesnt work
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&cThis price doesn't work.&r")

    //* overbid
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&cYour price is way over the best order/offer's price.&r")

    //* too expensive
    ChatLib.simulateChat('&r&6[Bazaar] &r&c&r&cYou cannot afford this!&r')

    //* price not parse-able
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&cCouldn't parse that price!&r")

    //* too much overbid
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&cYou are overbidding too much!&r")

    //* allowed unit price
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&fAllowed unit price: &r&63.3 coins&r")

    //* no buyers for item
    ChatLib.simulateChat("&r&6[Bazaar] &r&c&r&cCouldn't find any buyers for &fEnd Stone&c!&r")
}).setName('bzp2');                 