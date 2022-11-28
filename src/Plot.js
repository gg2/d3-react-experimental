// NPM packages
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

import {
    nonDiff, same, changed, removed, added,
    chartHeight, sharedLeftMargin
} from './resources/constants';
import {
    capitalize,
    format,
    secondsToReadableDate,
    getDiff
} from './utils';


function getDataForX(x, data, interval)
{
    let point = null;
    let upperBound;

    for (let i=0; i < data.length; i++) {
        upperBound = data[i][0] + interval;
        if (x <= upperBound) {
            point = data[i];
            break;
        }
    }
    return point;
}

let uniqueId = 0;

const useD3Plot = (renderD3Plot) => {
    const chartRef = useRef(null);

    useEffect(() => {
        renderD3Plot(d3.select(chartRef.current));
        //return () => {}; // TODO: Does this matter?
    }, [ renderD3Plot ]);

    return chartRef;
};

const D3Plot = ({ plotData, plotId }) => {

    const plotDataA = plotData['A'];
    const plotDataB = ( plotData['B'] ? plotData['B'] : undefined );
    const labels = plotDataA.labels;
    const tooltips = plotDataA.tooltips;
    const dataA = plotDataA.values;
    const dataB = ( plotDataB ? plotDataB.values : undefined );
    const interval = plotDataA.interval;

    const chartWidth = 1000;
    const margins = {
        top: 10,
        right: 120,
        bottom: 30,
        left: sharedLeftMargin,
    };
    const plotWidth = chartWidth - margins.left - margins.right;
    const plotHeight = chartHeight - margins.top - margins.bottom;

    // TODO: This gets moved up a level to Plot()
    const activePlot = ( labels.includes('mean') ? labels.indexOf('mean') : 0 );

    let beg = Infinity;
    let end = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    [dataA, dataB].forEach((data) => {
        if (data) {
            beg = Math.min(beg, data[activePlot][0][0]);
            end = Math.max(end, data[activePlot][data[activePlot].length-1][0]);

            data[activePlot].forEach(d => {
                yMin = Math.min(yMin, d[1]);
                yMax = Math.max(yMax, d[1]);
            });
        }
    });

    // This differs from the example:
    // 1) Has to consider multiple plots on display (potential for)
    // 2) Has to handle switching which plot(s) are displayed
    // 3) User interactions enabled:
    //    - zoom
    //    - panning
    const chartRef = useD3Plot((svg) => {

        // Configure axes
        let x = d3.scaleTime()
            .range([margins.left, plotWidth + margins.left])
            .domain([beg, end]);
        let y = d3.scaleLinear()
            .range([plotHeight + margins.top, margins.top])
            .domain([yMin, yMax]);

        const xAxis = (g) => {
            g.attr('transform', `translate(0,${chartHeight - margins.bottom})`)
            .style('color', '#ededfd')
            .call(d3.axisBottom(x));
        };
        const yAxis = (g) => {
            g.attr('transform', `translate(${margins.left},0)`)
            .style('color', '#ededfd')
            .call(d3.axisLeft(y));
        };
        svg.select('.x.axis').call(xAxis);
        svg.select('.y.axis').call(yAxis);

        // TODO: KEEP? {
        // SVG generators
        const line = d3.line()
            .defined(function(d) {
                return d[1] !== null;
            });

        const area = d3.area()
            .defined(function(d) {
                return d !== null;
            })
            .y0(plotHeight + margins.top)
            .y1(margins.top);
        // }

        const pathGroup = svg.select('.paths');
        const paths = [];
        let circles = [];
        const diffBands = {};

        const addLine = function(data, diff) {
            paths.push(
                pathGroup.selectAll('path')
                .data(data)
                .join('path')
                .attr('class', `line ${diff}`)
                .attr('clip-path', `url(#plot${plotId})`)
                .attr('x', (d) => x(d[0]))
                .attr('y', (d) => y(d[1]))
            );
        };

        if (dataB) {
            // [same, changed, removed, added].forEach((diff) => {
            //     diffBands[diff] = pathGroup.append('path')
            //         .attr('class', `area ${diff}`)
            //         .attr('clip-path', `url(#plot${plotId})`);
            // });

            addLine(dataB, added);
            addLine(dataA, removed);
        }
        else {
            addLine(dataA, nonDiff);
        }

        // Make sure transform is within bounds
        // let t = zoom.translate();
        // let tx = t[0],
        //     ty = t[1];

        // const leftOvershoot = x(beg) - margins.left;
        // if (leftOvershoot > 0)
        //     tx -= leftOvershoot;

        // const rightOvershoot = x(end) - (margins.left + plotWidth);
        // if (rightOvershoot < 0)
        //     tx -= rightOvershoot;

        // zoom.translate([tx, ty]);

        // Get the data visible in the current window
        // const windowBeg = x.invert(margins.left).getTime();
        // const windowEnd = x.invert(margins.left + plotWidth).getTime();

        // const visibleData = [];
        // const times = dataA[activePlot].map( (d) => { return d[0] });
        // [dataA, dataB].forEach( data => {
        //     if (data) {
        //         // Get indices before and after data visible in the window
        //         let i_beg = d3.bisectLeft(times, windowBeg);
        //         let i_end = d3.bisectRight(times, windowEnd, i_beg);
        //         i_beg = Math.max(0, i_beg - 1);
        //         i_end = Math.min(data[activePlot].length, i_end + 1);
        //         // Get the data between these indices
        //         visibleData.push(...data[activePlot].slice(i_beg, i_end));
        //     }
        // });
        //const yExtent = d3.extent(visibleData, (d) => { return d[1] });

        // Set y domain
        //y.domain(yExtent);
        line.y( (d) => { return y(d[1]) });

        // Set zoom scale limits
        // zoom.scaleExtent([1, (end - beg) / interval]);
        // svg.select('.x.axis').call(xAxis);
        // svg.select('.y.axis').call(yAxis); // TODO: DELETE ME AND UNCOMMENT BELOW
        // svg.select('.y.axis').call(yAxis.tickFormat( (d) => {
        //     if (d >= Math.pow(10, 6))
        //         return d.toExponential(2);
        //     else if (d <= Math.pow(-10, 6))
        //         return d.toExponential(1);
        //     return d.toPrecision(7).replace(/0+$/,"");  // remove trailing zeros
        // }));

        // for (let i = 0; i < circles.length; i++) {
        //     circles[i].remove();
        // }
        // circles = [];

        // paths.forEach((path, idx) => {
        //     path.data([visibleData[idx]])
        //         .attr('d', line);
        //     const segments = path.attr('d').split('M')
        //     let pts = ['0','0'];
        //     for (let k = 1; k < segments.length; k++) {
        //         if (!~segments[k].indexOf('L')) {
        //             pts = segments[k].split(',');
        //             circles.push(pathGroup.append('circle')
        //                 .attr('class', path.attr('class').split(' ')[1])
        //                 .attr('cx', pts[0])
        //                 .attr('cy', pts[1])
        //                 .attr('r', 2)
        //                 .attr('clip-path', `url(#plot${plotId})`));
        //         }
        //     }
        // });

        // if (dataB) {
        //     drawBackground(visibleData[0], visibleData[1]);
        // }

        // const drawBackground = function(visibleDataA, visibleDataB) {
        //     const areaData = {
        //         same: [],
        //         changed: [],
        //         added: [],
        //         removed: [],
        //     };
        //     const halfInterval = interval / 2;

        //     function addAreaData(t, diff) {
        //         const aD = areaData[diff];
        //         if (aD.length && aD[aD.length-1] !== null) {
        //             aD[aD.length-1] = t + halfInterval;
        //         }
        //         else {
        //             aD.push(t - halfInterval);
        //             aD.push(t + halfInterval);
        //         }
        //         // Push null onto the other areas
        //         for (const [key, aD] of Object.entries(areaData)) {
        //             if (diff !== key && aD[aD.length-1])
        //                 aD.push(null);
        //         }
        //     }

        //     visibleDataA.forEach( (dA, idx) => {
        //         const dB = visibleDataB[idx];
        //         const diff = getDiff(dA[1], dB[1]);
        //         addAreaData(dA[0], diff);
        //     });
        //     area.x(x);
        //     for (const diff in areaData) {
        //         diffBands[diff].data(areaData[diff])
        //             //.attr('d', area);
        //     }
        // }

        // Create zoom
        //const zoom = d3.zoom();
        // TODO: May need to manually handle x-axis on zoom...
        // https://stackoverflow.com/questions/55376779/updating-zoom-behavior-from-v3-to-v5
        // zoom.on('zoom', draw);

        // Text displaying the selected data point (currently x-axis date only)
        const tooltipText = svg.select('text.mouse.date');
        // Vertical line at the selected date
        const mouseLine = svg.select('line.data.line');
        // Pane which holds event listeners for plot
        svg.select('.listener').on('mousemove', function(event) {
                const mousePos = d3.pointer(event);
                const x0 = x.invert(mousePos[0]);
                const point = getDataForX(x0, dataA, interval/2);
                if (point === null) return;
                const xTime = point[0];
                tooltipText.text(secondsToReadableDate(xTime))
                    .attr('x', x(xTime))
                    .attr('hidden', null);
                mouseLine
                    .attr('x1', x(xTime))
                    .attr('x2', x(xTime));
            })
            //.call(zoom);

    });

    // Target structure:
    // svg.plot
    //   g.x.axis
    //   g.y.axis
    //   clipPath.clip<ID>
    //     rect
    //   g
    //     path.same.area
    //     path.changed.area
    //     path.added.area
    //     path.removed.area
    //     path.old.line clip-path=url(#clip1)
    //     path.new.line clip-path=url(#clip1)
    //   text.mouse.date
    //   line.date.line
    //   rect.listener
    return (
        <svg
            ref={ chartRef }
            style={{
                height: chartHeight,
                width: '100%',
                margin: 0
            }}
        >
            <g className="x axis" />
            <g className="y axis" />
            <clipPath id={`plot${plotId}`} >
                <rect
                    width={ plotWidth }
                    height={ plotHeight }
                    x={ margins.left }
                    y={ margins.top }
                    fill="none"
                />
            </clipPath>
            <g className="paths" />
            <text
                y={ margins.top }
                className="mouse date"
            />
            <line
                y1={ margins.top }
                y2={ plotHeight + margins.top }
                className="date line"
            />
            <rect
                height={ plotHeight }
                width={ plotWidth }
                className="listener"
                x={ margins.left }
                y={ margins.top }
            />
        </svg>
    );
};


const Plot = ({ plotData }) => {

    const [ plotId, ] = useState(++uniqueId);

    return (
        <D3Plot
            plotData={ plotData }
            plotId={ plotId }
        />
    ); 
};

export { Plot };
