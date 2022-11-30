// NPM packages
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import {
    nonDiff, same, changed, removed, added,
    diffColors,
    chartHeight, sharedLeftMargin
} from './resources/constants';
import {
    secondsToReadableDate
} from './utils';


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
// https://observablehq.com/@d3/multi-line-chart
const MultiLineChart = ({ plotData }) => {

    const chartWidth = 1400; // outer width, in pixels
    const margins = {
        top: 30,
        right: 30,
        bottom: 30,
        left: sharedLeftMargin,
    };
    const plotWidth = chartWidth - margins.left - margins.right;
    const plotHeight = chartHeight - margins.top - margins.bottom;
    const diff = changed; // in actual usage outside this experiment, would be provided to MultiLineChart as a parameter
    const [ d3PlotConfig, ] = useState({
        curve: d3.curveLinear, // method of interpolation between points
        margins: margins,
        plotWidth: plotWidth,
        plotHeight: plotHeight,
        xType: d3.scaleUtc, // the x-scale type
        xRange: [margins.left, plotWidth + margins.left], // [left, right]
        yType: d3.scaleLinear, // the y-scale type
        yRange: [chartHeight - margins.bottom, margins.top], // [bottom, top]
        yLabel: "Random Value ($)", // a label for the y-axis; in actual usage, would be determined by/provided with data
        dynamicY: false, // y-axis follows data (true), or always based at 0 (false)?
        textColor: diffColors[same].dark, // color of axes labels and other text
        axisFontSize: "1.222222em", // font-size of axes 
        tooltipFontSize: "1.555555em", // font-size of tooltip text
        strokeLinecap: "round", // stroke line cap of the line
        strokeLinejoin: "round", // stroke line join of the line
        strokeWidth: 1.5, // stroke width of line, in pixels
        strokeOpacity: 1, // stroke opacity of line
        mixBlendMode: null, // blend mode of lines
        // TODO: Change mixBlendMode to setting color opacity to 100%
    });
    const chartElemRefs = useRef({});

    function getPlotColor(z) { // z == d.src
        const _z = ( !z ? nonDiff : ( diff === added ? added : z ));
        return diffColors[_z].line;
    }

    function yFormat(d) { // formats y-axis tick labels
        if (d >= Math.pow(10, 6) || d <= -1 * Math.pow(10, 6)) {
            return new Intl.NumberFormat('en-US', {style: 'decimal', notation: "compact", compactDisplay: "short"}).format(d);
        }
        else if (d <= Math.pow(10, -6) && d >= -1 * Math.pow(10, -6) && d !== 0) {
            return d.toExponential(2);
        }
        else {
            return d.toPrecision(7).replace(/0+$/,"");  // remove trailing zeros
        }
    }

    // Compute values.
    const X = d3.map(plotData, d => d.x); // Array of times
    const Y = d3.map(plotData, d => d.y); // Array of data values
    const Z = d3.map(plotData, d => d.src); // Array of the "category" -- d.src (A|B), in this case.
    //const O = d3.map(plotData, d => d); // Array of the input values <= Exactly the same as the input data
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
            .attr("style", "max-width: 100%; height: auto; height: intrinsic; background-color: #282c34;")
            .style("-webkit-tap-highlight-color", "transparent")
            .selectAll('*').remove();

        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${chartHeight - margins.bottom})`)
            .call(xAxis)
            .style("color", cfg.textColor)
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${margins.left * .926},0)`)
            .call(yAxis)
            .style("color", cfg.textColor)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", plotWidth)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", 0)
                .attr("y", cfg.axisFontSize)
                .attr("fill", diffColors[same].dark)
                .attr("text-anchor", "end")
                .text(cfg.yLabel))
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);

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
                .style("mix-blend-mode", cfg.mixBlendMode)
                .attr("stroke", ([z]) => getPlotColor(z))
                .attr("d", ([, I]) => line(I));
        chartElemRefs.current['paths'] = paths;

        const circles = svg.select("g.plotPaths")
            .selectAll("circle.plotPathPt")
            .data(d3.filter(plotData, (d, i) => defined(d, i)))
            .join("circle")
                .attr("class", d => `plotPathPt plotPathPt${d.src} plotPath${d.src}`)
                .attr("fill", d => getPlotColor(d.src))
                .attr("stroke", "none")
                .attr("r", cfg.strokeWidth)
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y));
        chartElemRefs.current['circles'] = circles;

        const tooltip = svg.append("g")
            .attr("class", "plotTooltip")
            .attr("display", "none");
        tooltip.append("circle")
                .attr("fill", "none")
                .attr("stroke", cfg.textColor)
                .attr("r", cfg.strokeWidth * 1.666667);
        tooltip.append("text")
                .attr("fill", cfg.textColor)
                .attr("text-anchor", "middle")
                .attr("y", 27);
        chartElemRefs.current['tooltip'] = tooltip;

        return svg;
    });

    function pointermoved(event) {
        // const svg = d3.select(chartRef.current);
        //const paths = chartElemRefs.current['paths'];
        const tooltip = chartElemRefs.current['tooltip'];

        const [xm, ym] = d3.pointer(event);
        const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point

        //paths.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
        // TODO: Handle circles
        const x = xScale(X[i]);
        const y = yScale(Y[i]);
        const xMax = xScale(X[X.length-1]);
        tooltip.attr("transform", `translate(${x},${y})`);
        const tooltipText = tooltip.select("text");
        const tooltipTextText = secondsToReadableDate(X[i]/1000);
        tooltipText.text(tooltipTextText)
            .attr("transform", `translate(0,-${Math.floor(5 + y)})`) //${plotHeight - yScale(Y[i])})`)
            .attr("text-anchor", ( x < xMax*0.125 ? "start" : ( x > xMax*0.875 ? "end" : "middle" )));
        // svg.property("value", plotData[i]);
        // svg.dispatch("input", {bubbles: true});
    }

    function pointerentered() {
        //const paths = chartElemRefs.current['paths'];
        const tooltip = chartElemRefs.current['tooltip'];

        //paths.style("mix-blend-mode", null).style("stroke", "#ddd");
        // TODO: Handle circles
        tooltip.attr("display", null);
    }

    function pointerleft() {
        // const svg = d3.select(chartRef.current);
        //const paths = chartElemRefs.current['paths'];
        const tooltip = chartElemRefs.current['tooltip'];

        //paths.style("mix-blend-mode", d3PlotConfig.mixBlendMode).style("stroke", null);
        // TODO: Handle circles
        tooltip.attr("display", "none");
        // svg.property("value", null);
        // svg.dispatch("input", {bubbles: true});
    }

    return (
        <svg
            ref={ chartRef }
            width={ chartWidth }
            height={ chartHeight }
            onPointerEnter={ pointerentered }
            onPointerMove={ pointermoved }
            onPointerLeave={ pointerleft }
            onTouchStart={ event => event.preventDefault() }
        ></svg>
    );
};

export { MultiLineChart };
