import randomColor from 'randomcolor';

function getUniqueRandomColor(existingColors) {
    const color = randomColor();
    if (existingColors.includes(color)) {
        return getUniqueRandomColor(existingColors);
    }
    return color;
}

export {
    getUniqueRandomColor
}