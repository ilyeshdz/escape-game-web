/**
 * Flag system for tracking game state conditions
 */
let flags = {};

export function initFlags(defaultFlags = {}) {
    flags = { ...defaultFlags };
}

export function setFlag(flagName) {
    const wasSet = flags[flagName] === true;
    flags[flagName] = true;
    return !wasSet;
}

export function unsetFlag(flagName) {
    flags[flagName] = false;
}

export function hasFlag(flagName) {
    return flags[flagName] === true;
}

export function hasAllFlags(flagNames) {
    return flagNames.every(hasFlag);
}

export function hasAnyFlag(flagNames) {
    return flagNames.some(hasFlag);
}

export function hasNoneOfFlags(flagNames) {
    return flagNames.every(flagName => !hasFlag(flagName));
}

export function checkCondition(condition) {
    if (!condition) return true;
    if (condition.requireFlags && !hasAllFlags(condition.requireFlags)) return false;
    if (condition.requireAnyFlags && !hasAnyFlag(condition.requireAnyFlags)) return false;
    if (condition.requireNotFlags && !hasNoneOfFlags(condition.requireNotFlags)) return false;
    return true;
}

export function getFlags() {
    return { ...flags };
}

export function resetFlags(defaultFlags = {}) {
    flags = { ...defaultFlags };
}

export function debugFlags() {
    console.log('=== FLAGS DEBUG ===');
    const flagList = Object.entries(flags);
    if (flagList.length === 0) {
        console.log('No flags set');
    } else {
        flagList.forEach(([name, value]) => {
            console.log(`  ${name}: ${value}`);
        });
    }
    console.log('==================');
}
