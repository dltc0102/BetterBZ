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
        const fLine = line.removeFormatting();
        const areaMatch = fLine.match(/Area: (.+)/);
        if (areaMatch) rawArea = areaMatch[1];
    });
    return rawArea;
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

