
export const nonDiff = 'nonDiff'
export const same    = 'same';
export const changed = 'changed';
export const removed = 'removed';
export const added   = 'added';

export const diffKeys = {
    same: same,
    changed: changed,
    removed: removed,
    added: added,
};

export const fillOpacity = 0.05;

export const diffColors = {};
diffColors[nonDiff] = { // Ice blue
    light: 'rgba(0,0,180,1.0)',
    main: 'rgba(45,90,180,1.0)',
    dark: 'rgba(92,153,214,1.0)',
    contrastText: 'rgba(0,0,0,0.97)',
    line: 'rgba(92,153,214,1.0)',
    fill: `rgba(92,153,214,${fillOpacity})`,
};
diffColors[same] = { // Blueberry grey
    light: 'rgba(50,50,50,1.0)',
    main: 'rgba(128,128,128,1.0)',
    dark: 'rgba(186,186,210,1.0)',
    contrastText: 'rgba(0,0,0,0.97)',
    line: 'rgba(186,186,210,1.0)',
    fill: `rgba(186,186,186,0.0)`,
};
diffColors[same+'_RxG'] = { // Goldenrod khaki
    light: 'rgba(0,0,180,1.0)',
    main: 'rgba(180,120,80,1.0)',
    dark: 'rgba(207,191,143,1.0)',
    contrastText: 'rgba(255,255,255,0.97)',
    line: 'rgba(207,191,143,1.0)',
    fill: `rgba(207,191,143,${fillOpacity})`,
};
diffColors[changed] = { // Ice blue
    light: 'rgba(0,0,180,1.0)',
    main: 'rgba(45,90,180,1.0)',
    dark: 'rgba(92,153,214,1.0)',
    contrastText: 'rgba(255,255,255,0.97)',
    line: 'rgba(92,153,214,1.0)',
    fill: `rgba(92,153,214,${fillOpacity})`,
};
diffColors[changed+'_alt'] = { // "Purple" blue
    light: 'rgba(31,31,190,1.0)',
    main: 'rgba(96,96,220,1.0)',
    dark: 'rgba(123,123,234,1.0)',
    contrastText: 'rgba(255,255,255,0.97)',
    line: 'rgba(123,123,234,1.0)',
    fill: `rgba(123,123,234,${fillOpacity})`,
};
diffColors[removed] = { // Red
    light: 'rgba(128,0,0,0.5)',
    main: 'rgba(150,0,0,1.0)',
    dark: 'rgba(240,0,0,0.6)',
    contrastText: 'rgba(255,255,255,0.97)',
    line: 'rgba(255,0,0,0.5)',
    fill: `rgba(240,0,0,${fillOpacity})`,
};
diffColors[added] = { // Green
    light: 'rgba(0,128,0,0.5)',
    main: 'rgba(0,150,0,1.0)',
    dark: 'rgba(0,240,0,0.5)',
    contrastText: 'rgba(255,255,255,0.97)',
    line: 'rgba(0,255,0,0.3)',
    fill: `rgba(0,240,0,${fillOpacity})`,
};
diffColors['inactive'] = {
    light: '#666666',
    main: '#808080',
    dark: '#999999',
    contrastText: '#000000',
    line: '#999999',
    fill: `rgba(127,127,127,${fillOpacity})`,
};
diffColors['A'] = diffColors[removed];
diffColors['B'] = diffColors[added];

export const noData = `\u2014`;

export const chartHeight = 504;
export const sharedLeftMargin = 72;
