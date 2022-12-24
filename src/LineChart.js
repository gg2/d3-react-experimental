// NPM packages
import React, { useState, useRef,  useEffect } from 'react';
import * as d3 from 'd3';

import {
    nonDiff, same, changed, removed, added,
    diffColors,
    chartHeight, sharedLeftMargin
} from './resources/constants';
import {
    secondsToReadableDate,
} from './utils';

diffColors['A'] = diffColors[nonDiff];


// TODO, options:
// - Set up React Component so React will not update the svg element. (Empty svg, with a useRef applied.)
//   ! D3 handles that part of the DOM entirely.
//   https://reactjs.org/docs/integrating-with-other-libraries.html
// 
// - Move as much as possible into the useD3Plot.
//   - Adhere to the original example.
//   - Apply things programmatically (event handlers) and see if they can be contained in the hook.
// - Move the function called by useD3Plot out of the React Component.
//   - Pass everything in as parameters.
// ! useD3Plot can have its own useState...
// 
// - Apply useMemo and what all else to the other variables.
// - Apply useState to xScale, and other zoom properties?




// Source for using D3 in React:
// https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
const useD3Plot = (renderD3Plot) => {
    const chartRef = useRef(null);

    useEffect(() => {
        renderD3Plot(d3.select(chartRef.current));
    }, [ renderD3Plot ]);

    return chartRef;
};

// Source:
// https://observablehq.com/@d3/line-chart
const LineChart = ({ plotData }) => {

    const plotId = "Ned";
    let diff = nonDiff;
    let chartWidth = 1400; // outer width, in pixels
    const margins = {
        top: 30,
        right: 30,
        bottom: 30,
        left: sharedLeftMargin,
    };
    const plotWidth = chartWidth - margins.left - margins.right;
    const plotHeight = chartHeight - margins.top - margins.bottom;
    const [ d3PlotConfig, ] = useState({
        curve: d3.curveLinear, // method of interpolation between points
        margins: margins,
        plotWidth: plotWidth,
        plotHeight: plotHeight,
        xType: d3.scaleUtc, // the x-scale type
        xRange: [margins.left, plotWidth + margins.left], // [left, right]
        yType: d3.scaleLinear, // the y-scale type
        yRange: [chartHeight - margins.bottom, margins.top], // [bottom, top]
        dynamicY: false, // y-axis follows data? or always based at 0?
        textColor: diffColors[same].dark, // color of axes labels and other text
        axisFontSize: "1.222222em", // font-size of axes 
        tooltipFontSize: "1.555555em", // font-size of tooltip text
        strokeLinecap: "round", // stroke line cap of the line
        strokeLinejoin: "round", // stroke line join of the line
        strokeWidth: 2.0, // stroke width of line, in pixels
        strokeOpacity: 1, // stroke opacity of line
    });
    const [ activeIndex, setActiveIndex ] = useState(-1);
    const chartElemRefs = useRef({});

    function getPlotColor(z) { // z == d.src
        const _z = ( !z ? nonDiff : ( diff === added ? added : z ));
        return diffColors[_z].line;
    }

    function yFormat(d) { // formats y-axis tick labels
        if (d >= Math.pow(10, 12) || d <= -1 * Math.pow(10, 12) ||
           (d <= Math.pow(10, -6) && d >= -1 * Math.pow(10, -6) && d !== 0))
        {
            return d.toExponential(2);
        }
        else if (d >= Math.pow(10, 6) || d <= -1 * Math.pow(10, 6)) {
            return new Intl.NumberFormat('en-US', {style: 'decimal', notation: "compact", compactDisplay: "short"}).format(d);
        }
        else {
            return d.toPrecision(7).replace(/0+$/,"");  // remove trailing zeros
        }
    }

    // Compute values.
    const X = d3.map(plotData, d => d.x); // Array of times
    const Y = d3.map(plotData, d => d.y); // Array of data values
    const Z = d3.map(plotData, d => d.src); // Array of the "category" -- d.src (A|B), in this case.
    let defined = d => !( // identifies gaps in data
        [null, undefined].includes(d.x) ||
        isNaN(d.x) ||
        [null, undefined].includes(d.y) ||
        isNaN(d.y)
    );
    const D = d3.map(plotData, defined); // Array of true|false

    // Compute default domains, and unique the z-domain.
    let xDomain = d3.extent(X); // [xmin, xmax]
    let yDomain = (() => { // [ymin, ymax]
        let yMin = ( d3PlotConfig.dynamicY ? d3.min(Y) : d3.min([0, d3.min(Y)]) );
        let yMax = d3.max(Y, d => typeof d === "string" ? +d : d);
        let yPadding = (yMax - yMin) * .02;
        yMin = yMin - yPadding;
        yMax = yMax + yPadding;
        return [yMin, yMax];
    })();
    let zDomain = new d3.InternSet(Z); // Exactly as expected: Z reduced to a set of 2

    // Omit any data not present in the z-domain.
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i])); // Array of values 0 -> X.length - 1, continuous ?unless Z has bad values?

    // Construct scales for axes.
    const xScale = d3PlotConfig.xType(xDomain, d3PlotConfig.xRange);
    const yScale = d3PlotConfig.yType(yDomain, d3PlotConfig.yRange);


    const chartRef = useD3Plot((svg) => {
        const cfg = d3PlotConfig;

        // Construct axes.
        const xAxis = d3.axisBottom(xScale)
            .ticks(chartWidth / (chartWidth/12))
            .tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale)
            .ticks(chartHeight / (chartHeight/10))
            .tickSizeInner(4)
            .tickFormat(yFormat)
            .tickPadding(9);

        // Construct a line generator.
        const line = d3.line()
            .defined(i => D[i])
            .curve(cfg.curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));

        svg
            .attr("viewBox", [0, 0, chartWidth, chartHeight])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic; background-color: #282c34; -webkit-tap-highlight-color: transparent;")
            .selectAll('*').remove();

        svg.append("clipPath")
            .attr("id", `clip${plotId}`)
            .append("rect")
                .attr("x", margins.left)
                .attr("y", margins.top)
                .attr("width", plotWidth)
                .attr("height", plotHeight);

        const xAxisGroup = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${chartHeight - margins.bottom})`)
            .call(xAxis)
            .style("color", cfg.textColor)
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);
        chartElemRefs.current['xAxisGroup'] = xAxisGroup;

        const yAxisGroup = svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${margins.left * .926},0)`)
            .call(yAxis)
            .style("color", cfg.textColor)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", plotWidth)
                .attr("stroke-opacity", 0.1))
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);
        chartElemRefs.current['yAxisGroup'] = yAxisGroup;

        const paths = svg.append("g")
            .attr("class", "plotPaths")
            .attr("fill", "none")
            .attr("stroke-width", cfg.strokeWidth)
            .attr("stroke-linecap", cfg.strokeLinecap)
            .attr("stroke-linejoin", cfg.strokeLinejoin)
            .attr("stroke-opacity", cfg.strokeOpacity)
            .selectAll("path")
            .data(d3.group(I, i => Z[i]))
            .join("path")
                .attr("class", ([z]) => `plotLine${z} plotPath${z}`)
                .attr("clip-path", `url(#clip${plotId})`)
                .attr("stroke", ([z]) => getPlotColor(z))
                .attr("d", ([z, zI]) => line(zI));
        chartElemRefs.current['paths'] = paths;

        const tooltip = svg.append("g")
            .attr("class", "plotTooltip")
            .attr("display", "none");
        tooltip.append("circle")
                .attr("fill", "none")
                .attr("stroke", cfg.textColor)
                .attr("r", cfg.strokeWidth * 1.666667);
        tooltip.append("text")
                .attr("fill", cfg.textColor);
        if (activeIndex > -1) {
            tooltip.attr("display", null);
            updateTooltip(activeIndex, tooltip);
        }
        chartElemRefs.current['tooltip'] = tooltip;

        return svg;
    });

    /* Events may fire before render */

    function updateTooltip(i, tooltip) {
        const x = xScale(X[i]); // Get x pixel coordinate of data at i
        const y = yScale(Y[i]); // Get y pixel coordinate of data at i
        if ((x === 0 || x) && (y === 0 || y)) {
            tooltip.attr("transform", `translate(${x},${y})`);
            const tooltipText = tooltip.select("text");
            const tooltipTextText = secondsToReadableDate(X[i]/1000);
            tooltipText.text(tooltipTextText)
                .attr("transform", `translate(0,-${Math.floor(y - 21)})`) // Arbitrary portion of margins.top //${plotHeight - yScale(Y[i])})`) // Overlays it on the x-axis
                .attr("text-anchor", ( x < chartWidth*0.125 ? "start" : ( x > chartWidth*0.875 ? "end" : "middle" )));
        }
    }

    function pointermoved(event) {
        const tooltip = chartElemRefs.current['tooltip'];
        if (tooltip) {
            const [xm, ym] = d3.pointer(event);
            const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
            updateTooltip(i, tooltip);
            setActiveIndex( i >= plotData.length ? i - plotData.length : i );
        }
    }

    function pointerentered() {
        const tooltip = chartElemRefs.current['tooltip'];
        if (tooltip) tooltip.attr("display", null);
    }


    return (
        <svg
            ref={ chartRef }
            style={{ width: '100%', height: `${chartHeight}px`, margin: 0, backgroundColor: '#1a1a1a' }}
            width={ chartWidth }
            height={ chartHeight }
            onPointerEnter={ pointerentered }
            onPointerMove={ pointermoved }
            onTouchStart={ event => event.preventDefault() }
        ></svg>
    );
};

export { LineChart };
