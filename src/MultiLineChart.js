// NPM packages
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import {
    nonDiff, same, changed, removed, added,
    diffColors,
    chartHeight, sharedLeftMargin
} from './resources/constants';
import {
    secondsToReadableDate,
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
// https://observablehq.com/@d3/line-chart
// D3 with zoom in React
// https://www.youtube.com/watch?v=dxUyI2wfYSI
const MultiLineChart = ({ plotData }) => {

    const plotId = "Frank";
    const diff = changed; // in actual usage outside this experiment, would be provided to MultiLineChart as a parameter
    const chartWidth = 1400; // outer width, in pixels
    const margins = {
        top: 30,
        right: 30,
        bottom: 30,
        left: sharedLeftMargin,
    };
    const plotWidth = chartWidth - margins.left - margins.right;
    const plotHeight = chartHeight - margins.top - margins.bottom;
    const plotTop = margins.top;
    const plotBottom = plotHeight + plotTop;
    const plotLeft = margins.left;
    const plotRight = plotLeft + plotWidth;
    const [ d3PlotConfig, ] = useState({
        curve: d3.curveLinear, // method of interpolation between points
        margins: margins,
        plotWidth: plotWidth,
        plotHeight: plotHeight,
        plotTop: plotTop,
        plotBottom: plotBottom,
        plotLeft: plotLeft,
        plotRight: plotRight,
        xType: d3.scaleUtc, // the x-scale type
        xRange: [plotLeft, plotRight],
        yType: d3.scaleLinear, // the y-scale type
        yRange: [plotBottom, plotTop],
        dynamicY: false, // y-axis follows data (true), or always based at 0 (false)
        backgroundColor: '#1a1a1a',
        textColor: diffColors[same].dark, // color of axes labels and other text
        axisFontSize: "12px", // font-size of axes 
        tooltipFontSize: "14px", // font-size of tooltip text
        strokeLinecap: "round", // stroke line cap of the line
        strokeLinejoin: "round", // stroke line join of the line
        strokeWidth: 2.0, // stroke width of line, in pixels
        strokeOpacity: 1, // stroke opacity of line
    });
    const chartElemRefs = useRef({});
    const [ tooltipActive, setTooltipActive ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(-1);
    const [ tooltipCoords, setTooltipCoords ] = useState({x: 0, y: 0});
    const [ tooltipText, setTooltipText ] = useState('');
    const [ tooltipSticky, setTooltipSticky ] = useState(false);
    const [ zoomState, setZoomState ] = useState();


    const chartRef = useD3Plot((svg) => {
        const cfg = d3PlotConfig;

        // Compute working values
        const X = d3.map(plotData, d => d.x); // Array of times
        const Y = d3.map(plotData, d => d.y); // Array of data values
        const Z = d3.map(plotData, d => d.src); // Array of the "category": d.src (A|B), in this case.
        let defined = d => !( // identifies gaps in data
            [null, undefined].includes(d.x) ||
            isNaN(d.x) ||
            [null, undefined].includes(d.y) ||
            isNaN(d.y)
        );
        const D = d3.map(plotData, defined); // Array of true|false

        // Compute default domains, and unique the z-domain
        let xDomain = d3.extent(X); // [xmin, xmax]
        let yDomain = (() => { // [ymin, ymax]
            let yMin = ( cfg.dynamicY ? d3.min(Y) : d3.min([0, d3.min(Y)]) );
            let yMax = d3.max(Y, d => typeof d === "string" ? +d : d);
            let yPadding = (yMax - yMin) * .02;
            yMin = yMin - yPadding;
            yMax = yMax + yPadding;
            return [yMin, yMax];
        })();
        let zDomain = new d3.InternSet(Z); // Exactly as expected: Z reduced to a set of 2

        // Omit any data not present in the z-domain
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i])); // Array of values 0 -> X.length - 1, continuous ?unless Z has bad values?

        // Construct scales for axes
        const xScale = cfg.xType(xDomain, cfg.xRange);
        if (zoomState) {
            const xScaled = zoomState.rescaleX(xScale);
            xScale.domain(xScaled.domain());
        }
        const yScale = cfg.yType(yDomain, cfg.yRange);

        // Construct axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(chartWidth / (chartWidth/12))
            .tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale)
            .ticks(chartHeight / (chartHeight/10))
            .tickSizeInner(4)
            .tickFormat(yFormat)
            .tickPadding(9);

        // Construct a line generator
        const line = d3.line()
            .defined(i => D[i])
            .curve(cfg.curve)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]));

        // Event handlers
        // NOTE: Events may fire before render

        function pointerclick() {
            setTooltipSticky(!tooltipSticky);
        }

        function pointermoved(event) {
            if (chartElemRefs.current['tooltip'] && !tooltipSticky) {
                let [xm, ym] = d3.pointer(event);
                let i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
                let x = xScale(X[i]); // Get x pixel coordinate of data at i
                while (x < cfg.plotLeft && i < I.length) {
                    i++;
                    x = xScale(X[i]);
                }
                while (x > cfg.plotRight && i >= 0) {
                    i--;
                    x = xScale(X[i]);
                }
                const y = yScale(Y[i]); // Get y pixel coordinate of data at i
                if ((x === 0 || x) && (y === 0 || y) && 0 <= i && i < I.length) {
                    setActiveIndex( i >= plotData.length ? i - plotData.length : i );
                    setTooltipCoords({x: x, y: y});
                    setTooltipText(secondsToReadableDate(X[i]/1000));
                }
            }
        }

        function pointerentered() {
            if (chartElemRefs.current['tooltip']) {
                setTooltipActive(true);
            }
        }

        function pointerleft() {
            if (chartElemRefs.current['tooltip'] && !tooltipSticky) {
                setTooltipActive(false);
            }
        }

        function zoomed(event) {
            setZoomState(event.transform);
            setTooltipSticky(false);
            setTooltipCoords({x: -999, y: -99});
            setTooltipText('');
            // xScale.domain() ?
        }

        const zoom = d3.zoom()
            .scaleExtent([1, X.length])
            .translateExtent([[0, cfg.plotTop], [cfg.plotRight, cfg.plotBottom]])
            .on('zoom', zoomed);

        // Plot formats

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

        // Create the plot

        svg
            .attr("viewBox", [0, 0, chartWidth, chartHeight])
            .on("click", pointerclick)
            .on("pointerenter", pointerentered)
            .on("pointermove", pointermoved)
            .on("pointerleave", pointerleft);

        const xAxisGroup = svg.select("g.x-axis")
            .call(xAxis)
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);
        chartElemRefs.current['xAxisGroup'] = xAxisGroup;

        const yAxisGroup = svg.select("g.y-axis")
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".horizontal-grid").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("class", "horizontal-grid")
                .attr("x2", cfg.plotWidth)
                .attr("stroke-opacity", 0.1))
            .selectAll("text")
                .style("font-size", cfg.axisFontSize);
        chartElemRefs.current['yAxisGroup'] = yAxisGroup;

        const paths = svg.select("g.plotPaths")
            .selectAll("path")
            .data(d3.group(I, i => Z[i]))
            .join("path")
                .attr("class", ([z]) => `plotLine${z} plotPath${z}`)
                .attr("stroke", ([z]) => getPlotColor(z))
                .attr("d", ([z, z_I]) => line(z_I));
        chartElemRefs.current['paths'] = paths;

        const horizontalShift = ( tooltipCoords.x - margins.left < cfg.plotWidth * 0.1 ? 75 : ( tooltipCoords.x - margins.left > plotWidth * 0.9 ? -75 : 0 ));
        const verticalShift = Math.floor(cfg.plotBottom - tooltipCoords.y - 4);
        const tooltip = svg.select("g.plotTooltip")
            .attr("display", ( tooltipActive ? null : 'none' ))
            .attr("transform", `translate(${tooltipCoords.x},${tooltipCoords.y})`);
        tooltip.select("path")
                .attr("transform", `translate(${horizontalShift},${verticalShift})`) // Overlays it on the x-axis
                .attr("d", `M${-78},5H-5l5,-5l5,5H${80}v${25}h-${158}z`);
        tooltip.select("text")
                .text(tooltipText)
                .attr("text-anchor", "middle")
                .attr("transform", `translate(${horizontalShift},${verticalShift + 23})`) // Overlays it on the x-axis
        chartElemRefs.current['tooltip'] = tooltip;

        svg.call(zoom)
            .on("wheel", event => event.preventDefault());
        //    .on("wheel.zoom", null); // Disable scroll-wheel-based zooming

        return svg;
    });


    const svgStyle = {
        width: `${chartWidth}px`,
        maxWidth: '100%', 
        height: `${chartHeight}px`,
        margin: 0,
        backgroundColor: d3PlotConfig.backgroundColor,
        WebkitTapHighlightColor: 'transparent',
    };
    const stdText = {
        color: d3PlotConfig.textColor,
    };


    return (
        <svg
            ref={ chartRef }
            style={ svgStyle }
        >
            <defs>
                <clipPath id={`clip${plotId}`}>
                    <rect x={margins.left} y={margins.top} width={plotWidth} height={plotHeight} />
                </clipPath>
            </defs>
            <g className="axis x-axis"
                transform={ `translate(0,${plotBottom})` }
                style={ stdText }
            />
            <g className="axis y-axis"
                transform={ `translate(${margins.left * .926},0)` }
                style={ stdText }
            />
            <g className="plotPaths"
                clipPath={ `url(#clip${plotId})` }
                fill='none'
                strokeWidth={ d3PlotConfig.strokeWidth }
                strokeLinecap={ d3PlotConfig.strokeLinecap }
                strokeLinejoin={ d3PlotConfig.strokeLinejoin }
                strokeOpacity={ d3PlotConfig.strokeOpacity }
                onTouchStart={ event => event.preventDefault() }
            />
            <g className="plotTooltip" display='none'>
                <circle
                    fill='none'
                    stroke={ d3PlotConfig.textColor }
                    r={ d3PlotConfig.strokeWidth * 1.666667 }
                />
                <path
                    fill={ d3PlotConfig.backgroundColor }
                    stroke={ d3PlotConfig.textColor }
                />
                <text
                    fill={ d3PlotConfig.textColor }
                    fontSize={ d3PlotConfig.tooltipFontSize }
                />
            </g>
        </svg>
    );
};


export { MultiLineChart };
