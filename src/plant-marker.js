export const markerAttribute = {
    shape: {
        SQUARE: "square",
        RHOMB: "rhomb",
        CIRCLE: "circle"
    },
    color: {
        MAROON: 'maroon',
        RED: 'red',
        ORANGE_RED: 'range-red',
        DARK_ORANGE: 'dark-orange',
        OLIVE: 'olive',
        GREEN: 'green',
        LIME_GREEN: 'lime-green',
        DARK_CYAN: 'dark-cyan',
        DARK_BLUE: 'dark-blue',
        BLUE: 'blue',
        DARK_ORCHID: 'dark-orchid',
        SEA_GREEN: 'sea-green',
        INDIAN_RED: 'indian-red',
        DARK_SALMON: 'dark-salmon',
        KHAKI: 'khaki',
        DARK_SLATE_GRAY: 'dark-slate-gray',
    },
    size: {
        SMALL: 13,
        MEDIUM: 24,
        LARGE: 32
    }
};

const getMatchingShape = function (typeOfWorksName) {
    let shape = '';

    switch (typeOfWorksName) {
        case "integrated":
            shape = markerAttribute.shape.SQUARE;
            break;
        case "clinker":
            shape = markerAttribute.shape.RHOMB;
            break;
        case "grniding":
            shape = markerAttribute.shape.CIRCLE;
            break;
        default:
            console.log("unknown type of works: " + typeOfWorksName);
    }

    return shape;
}

