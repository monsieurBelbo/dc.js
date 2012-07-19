require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bubble chart');

var width = 1100;
var height = 200;

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.bubbleChart("#" + id);
    chart.width(width).height(height)
        .dimension(statusDimension)
        .group(statusMultiGroup)
        .xValue(function(p) {
            return p.value.value;
        })
        .yValue(function(p) {
            return p.value.count;
        })
        .x(d3.scale.linear().domain([0, 300]))
        .y(d3.scale.linear().domain([0, 10]))
        .transitionDuration(0);
    chart.render();
    return chart;
}

suite.addBatch({
    'bubble chart': {
        topic: function() {
            var chart = buildChart("chart");
            return chart;
        },
        'we get something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), statusDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), statusMultiGroup);
        },
        'width should be set': function(chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function(chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function(chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'transition duration should be set': function(chart) {
            assert.equal(chart.transitionDuration(), 0);
        },
        'margin should be set': function(chart) {
            assert.isNotNull(chart.margins());
        },
        'x can be set': function(chart) {
            assert.isTrue(chart.x() != undefined);
        },
        'x range round is auto calculated based on width': function(chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 1030);
        },
        'y can be set': function(chart) {
            assert.isTrue(chart.y() != undefined);
        },
        'y range round is auto calculated based on height': function(chart) {
            assert.equal(chart.y().range()[0], 160);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain should be set': function(chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 5);
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'root g should be translated to left corner': function(chart) {
            assert.equal(chart.select("svg g").attr("transform"), "translate(20,10)");
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(20,170)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(20,10)");
        },
        'x units should be set': function(chart) {
            assert.equal(chart.xUnits(), dc.units.integers);
        },
        'x axis should be created': function(chart) {
            assert.isNotNull(chart.xAxis());
        },
        'y axis should be created': function(chart) {
            assert.isNotNull(chart.yAxis());
        },
        'brush should be created': function(chart) {
            assert.isNotNull(chart.select("g.brush"));
        },
        'round should be off by default': function(chart) {
            assert.isTrue(chart.round() == null);
        },
        'round can be changed': function(chart) {
            chart.round(d3.time.day.round)
            assert.isNotNull(chart.round());
        },

        teardown: function(topic) {
            resetAllFilters();
        }
    }
});

suite.export(module);