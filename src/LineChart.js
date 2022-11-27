// NPM packages
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import {
    nonDiff, same, changed, removed, added,
    diffColors,
    chartHeight, sharedLeftMargin
} from './resources/constants';


const useD3Plot = (renderD3Plot) => {
    const chartRef = useRef(null);

    useEffect(() => {
        renderD3Plot(d3.select(chartRef.current));
    }, [ renderD3Plot ]);

    return chartRef;
};


const LineChart = ({ plotData }) => {

    let x = d => d[0]; // given d in data, returns the (temporal) x-value
    let y = d => d[1]; // given d in data, returns the (quantitative) y-value
    let defined = undefined; // for gaps in data
    let curve = d3.curveLinear; // method of interpolation between points
    let marginTop = 36; // top margin, in pixels
    let marginRight = 18; // right margin, in pixels
    let marginBottom = 36; // bottom margin, in pixels
    let marginLeft = sharedLeftMargin; // left margin, in pixels
    let width = 1400; // outer width, in pixels
    let height = chartHeight; // outer height, in pixels
    let xType = d3.scaleUtc; // the x-scale type
    let xDomain = undefined; // [xmin, xmax]
    let xRange = [marginLeft, width - marginRight]; // [left, right]
    let yType = d3.scaleLinear; // the y-scale type
    let dynamicY = false; // y-axis follows data? or always based at 0?
    let yDomain = undefined; // [ymin, ymax]
    let yRange = [height - marginBottom, marginTop]; // [bottom, top]
    let yFormat = (d) => { // a format specifier string for the y-axis
        if (d >= Math.pow(10, 6) || d <= -1 * Math.pow(10, 6)) {
            return new Intl.NumberFormat('en-US', {style: 'decimal', notation: "compact", compactDisplay: "short"}).format(d);
        }
        else if (d <= Math.pow(10, -6) && d >= -1 * Math.pow(10, -6) && d !== 0) {
            return d.toExponential(2);
        }
        else {
            return d.toPrecision(7).replace(/0+$/,"");  // remove trailing zeros
        }
    };
    let yLabel = "Random Value ($)"; // a label for the y-axis
    let textColor = "#babad2"; // color of axes labels and other text
    let axisFontSize = "1.25em"; // font-size of axes labels
    let strokeLinecap = "round"; // stroke line cap of the line
    let strokeLinejoin = "round"; // stroke line join of the line
    let strokeWidth = 2.0; // stroke width of line, in pixels
    let strokeOpacity = 1; // stroke opacity of line
    let mixBlendMode = "multiply"; // blend mode of lines

    const chartRef = useD3Plot((svg) => {

        // Compute values.
        const X = d3.map(plotData.A, x);
        const Y = d3.map(plotData.A, y);
        const I = d3.range(X.length);
        if (defined === undefined) defined = (d) => !(
            [null, undefined].includes(d[0]) ||
            isNaN(d[0]) ||
            [null, undefined].includes(d[1]) ||
            isNaN(d[1])
        );
        const D = d3.map(plotData.A, defined);

        // Compute default domains.
        if (xDomain === undefined) xDomain = d3.extent(X);
        if (yDomain === undefined) {
            let yMin = ( dynamicY ? d3.min(Y) : d3.min([0, d3.min(Y)]) );
            let yMax = d3.max(Y);
            let yPadding = (yMax - yMin) * .02;
            yMin = yMin - yPadding;
            yMax = yMax + yPadding;
            yDomain = [yMin, yMax];
        }

        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale)
            .ticks(width / (width/12))
            .tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale)
            .ticks(height / (height/10))
            .tickSizeInner(4)
            .tickFormat(yFormat)
            .tickPadding(9);

        // Construct a line generator.
        const line = d3.line()
            .defined(i => D[i])
            .curve(curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));

        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic; background-color: #282c34;")
            .selectAll('*').remove();

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .style("color", textColor)
            .selectAll("text")
                .style("font-size", axisFontSize);

        svg.append("g")
            .attr("transform", `translate(${marginLeft * .926},0)`)
            .call(yAxis)
            .style("color", textColor)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", 0)
                .attr("y", axisFontSize)
                .attr("fill", "green")
                .attr("text-anchor", "end")
                .text(yLabel))
            .selectAll("text")
                .style("font-size", axisFontSize);

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", diffColors.A.line)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .attr("d", line(I));

        const plotPtsA = d3.filter(plotData.A, d => defined(d));
        svg.selectAll(".plotPtsA")
            .data(plotPtsA)
            .join("circle")
              .attr("class", "plotPtsA")
              .attr("fill", diffColors.A.line)
              .attr("stroke", "none")
              .attr("r", strokeWidth)
              .attr("cx", d => xScale(d[0]))
              .attr("cy", d => yScale(d[1]));
    });


    return (
        <svg ref={ chartRef }></svg>
    );
};

export { LineChart };
