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


// TODO:
// Select out data to display (for 1 or both plots), based on selected set (n, ngood, mean, std, etc)
// Make the bridge to convert data from default to current working MultiLineChart format:
// Given active plot ("key"):
// - output: [{src: 'A|B', x: X, y: Y}, ...]
// - concatenate A and B data, if B exists.
// - add in src property.
// Test performance w/ basic, non-interactive version!
// Make tooltip work in test setup. Then integrate it into official repo.
// Zoom.
// Test like crazy, big and small, types, options!

const MultiLineChart = ({ multiData }) => {

    let x = d => d.x; // given d in data, returns the (temporal) x-value
    let y = d => d.y; // given d in data, returns the (quantitative) y-value
    let z = d => d.src; // given d in data, returns the (categorical) z-value
    let title = undefined; // given d in data, returns the title text
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
    let zDomain = undefined; // array of z-values
    let plotColor = (z) => { // stroke color of line, as a constant or a function of *z*
        if (!z) z = nonDiff;
        return diffColors[z].line;
    };
    let textColor = "#babad2"; // color of axes labels and other text
    let axisFontSize = "1.25em"; // font-size of axes labels
    let strokeLinecap = "round"; // stroke line cap of the line
    let strokeLinejoin = "round"; // stroke line join of the line
    let strokeWidth = 1.5; // stroke width of line, in pixels
    let strokeOpacity = 1; // stroke opacity of line
    let mixBlendMode = null; // blend mode of lines
    let voronoi = undefined; // show a Voronoi overlay? (for debugging)


    const chartRef = useD3Plot((svg) => {

        // Compute values.
        const X = d3.map(multiData, x); // Array of times
        const Y = d3.map(multiData, y); // Array of data values
        const Z = d3.map(multiData, z); // Array of the "category" -- plot source, in my case.
        const O = d3.map(multiData, d => d); // Array of the input values <= Exactly the same as the input data
        if (defined === undefined) defined = (d, i) => !(
            [null, undefined].includes(X[i]) ||
            isNaN(X[i]) ||
            [null, undefined].includes(Y[i]) ||
            isNaN(Y[i])
        );
        const D = d3.map(multiData, defined); // Array of true|false

        // Compute default domains, and unique the z-domain.
        if (xDomain === undefined) xDomain = d3.extent(X);
        if (yDomain === undefined) {
            let yMin = ( dynamicY ? d3.min(Y) : d3.min([0, d3.min(Y)]) );
            let yMax = d3.max(Y, d => typeof d === "string" ? +d : d);
            let yPadding = (yMax - yMin) * .02;
            yMin = yMin - yPadding;
            yMax = yMax + yPadding;
            yDomain = [yMin, yMax];
        }
        if (zDomain === undefined) zDomain = Z;
        zDomain = new d3.InternSet(zDomain); // Exactly as expected: Z reduced to a set of 2
    
        // Omit any data not present in the z-domain.
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i])); // Array of values 0 -> X.length - 1, continuous ?unless Z has bad values?
    
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

        // Compute titles.
        const T = title === undefined ? Z : title === null ? null : d3.map(multiData, title);

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
            .style("-webkit-tap-highlight-color", "transparent")
            .selectAll('*').remove()
            .on("pointerenter", pointerentered)
            .on("pointermove", pointermoved)
            .on("pointerleave", pointerleft)
            .on("touchstart", event => event.preventDefault());

        // An optional Voronoi display (for fun).
        if (voronoi) {
            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("d", d3.Delaunay
                    .from(I, i => xScale(X[i]), i => yScale(Y[i]))
                    .voronoi([0, 0, width, height])
                    .render());
        }

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
            .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
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

        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", typeof plotColor === "string" ? plotColor : null)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-linejoin", strokeLinejoin)
            .attr("stroke-opacity", strokeOpacity)
            .selectAll("path")
                .data(d3.group(I, i => Z[i]))
                .join("path")
                    .style("mix-blend-mode", mixBlendMode)
                    .attr("stroke", typeof plotColor === "function" ? ([z]) => plotColor(z) : null)
                    .attr("d", ([, I]) => line(I));

        const plotPts = d3.filter(multiData, (d, i) => defined(d, i));
        svg.selectAll(".plotPts")
            .data(plotPts)
            .join("circle")
              .attr("class", "plotPts")
              .attr("fill", d => plotColor(d.src))
              .attr("stroke", "none")
              .attr("r", strokeWidth)
              .attr("cx", d => xScale(d.x))
              .attr("cy", d => yScale(d.y));

        const dot = svg.append("g")
            .attr("display", "none");
    
        dot.append("circle")
            .attr("r", strokeWidth * 1.666667);
    
        dot.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", axisFontSize)
            .attr("text-anchor", "middle")
            .attr("y", -9);
    
        function pointermoved(event) {
            const [xm, ym] = d3.pointer(event);
            const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
            path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
            dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
            if (T) dot.select("text").text(T[i]);
            svg.property("value", multiData[i]).dispatch("input", {bubbles: true}); // TODO: Is this broken w/ O -> multiData?
        }
    
        function pointerentered() {
            path.style("mix-blend-mode", null).style("stroke", "#ddd");
            dot.attr("display", null);
        }
    
        function pointerleft() {
            path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
            dot.attr("display", "none");
            svg.node().value = null;
            svg.dispatch("input", {bubbles: true});
        }

    });


    return (
        <svg ref={ chartRef }></svg>
    );
};

export { MultiLineChart };
