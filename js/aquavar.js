var arrayMap = arraymap();
var gridster;
var currentId = 1;
var gutter = 15; // ul#sortable li
var item_padding = 5;
var right_margin = 20;
var sortable_margin_top = 60; // ul#sortable
var aqv_remove_height = 15; // div.aqv-item-control
var cols_max = 6;
var bloc_width = Math.floor(($(window).width() - right_margin - 7 * gutter) / 6);
var bloc_height = Math.floor(($(window).height() - 5 * gutter - sortable_margin_top) / 4);


function arraymap() {
    var ids = [];
    var maps = [];
    return {
        addMap: function (id, map) {
            var i;
            for (i = 0; i < ids.length && ids[i] != id; i++);
            if (i < ids.length)
                maps[i] = map;
            else {
                ids.push(id);
                maps.push(map);
            }
        },
        getMap: function (id) {
            var i;
            for (i = 0; i < ids.length && ids[i] != id; i++);
            if (i < ids.length)
                return maps[i];
            return undefined;
        }
    }
}

//// resize ////

function resizeItem($li) {
    var $item = $li.find('.aqv-item');
    if ($item.hasClass("aqv-plot")) {
        var adjust_layout = {
            width: $li.innerWidth() - item_padding,
            height: $li.innerHeight() - aqv_remove_height - item_padding
        };
        Plotly.relayout($item.attr("id"), adjust_layout);
    }
    else if ($item.hasClass("aqv-map")) {
        $item.width($li.innerWidth() - item_padding);
        $item.height($li.innerHeight() - aqv_remove_height - item_padding);
        setTimeout(function () { arrayMap.getMap($item.attr("id")).invalidateSize() }, 400);
    }
    else if ($item.hasClass("aqv-iframe")) {
        $item.width($li.innerWidth() - item_padding);
        $item.height($li.innerHeight() - aqv_remove_height - item_padding);
        var $iframe = $item.find("iframe")
        $iframe.width($item.innerWidth());
        $iframe.height($item.innerHeight());
    }
}

//// grilles ////

function resizeAll() {
    $(".aqv-item").fadeOut(500, function () {
        gridster.resize_widget_dimensions({
            widget_base_dimensions: [bloc_width, bloc_height],
            // max_cols: cols_max,
            widget_margins: [gutter, gutter]
        })
    });
    setTimeout(function () {
        $(".aqv-widget").each(function () {
            resizeItem($(this));
        });
        $(".aqv-item").fadeIn(500)
    },
        800
    );
}

function resize2x3() {
    cols_max = 6;
    bloc_width = Math.floor(($(window).width() - right_margin - 7 * gutter) / 6);
    bloc_height = Math.floor(($(window).height() - 5 * gutter - sortable_margin_top) / 4);
    resizeAll();
}

function resize3x4() {
    cols_max = 8;
    bloc_width = Math.floor(($(window).width() - right_margin - 9 * gutter) / 8);
    bloc_height = Math.floor(($(window).height() - 7 * gutter - sortable_margin_top) / 6);
    resizeAll();
}

function resize3x3() {
    cols_max = 6;
    bloc_width = Math.floor(($(window).width() - right_margin - 7 * gutter) / 6);
    bloc_height = Math.floor(($(window).height() - 7 * gutter - sortable_margin_top) / 6);
    resizeAll();
}

//// widgets ////
// function qui crée un widget pour le plot
function newWidgetPlot(wclass) {
    var imgr = "<img class=\"aqv-remove\" src=\"images/remove.png\">";
    var id = newId();
    var div2 = "<div id=\"" + id + "\" class=\"aqv-item " + wclass + "\"></div>";
    var newli = "<li class=\"aqv-widget\">" + div2 + imgr + "</li>";
    return { li: newli, id: id };
}

//function qui crée un widget radar
function newWidgetRadar() {
    var imgr = "<img class=\"aqv-remove\" src=\"images/remove.png\">";
    var id = newId();
    var div2 = "<div id=\"" + id + "\" class=\"aqv-item aqv-iframe\"><iframe src=\"http://www.radareu.cz\"></iframe></div>";
    var newli = "<li class=\"aqv-widget\">" + div2 + imgr + "</li>";
    return { li: newli, id: id };
}

//function qui crée un widget SIGMap
function newWidgetSIGMap() {
    var imgr = "<img class=\"aqv-remove\" src=\"images/remove.png\">";
    var id = newId();
    var div2 = "<div id=\"" + id + "\" class=\"aqv-item aqv-iframe\"><iframe id=\"ncamap_js\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://sig.nicecotedazur.org/appli/?site=signcajs_aquavar\" onload=\"trigger();\"></iframe></div>";
    var newli = "<li class=\"aqv-widget\" data-row=\"1\" data-col=\"1\" data-sizex=\"2\" data-sizey=\"2\">" + div2 + imgr + "</li>";
    return { li: newli, id: id };
}

//// id generator ////

function newId() {
    return "aqv-id-" + currentId++;
}

//ajout d'un widget radar à la grille, ce widget peut-être aussi supprimé de la grille
function newRadar() {
    var neww = newWidgetRadar();
    var newli = neww.li;
    var id = neww.id;
    gridster.add_widget(newli, 2, 2);

    var mymap = $("#" + id);
    mymap.mousedown(function (event) {
        event.stopPropagation();
    });
    mymap.next().click(function () {
        gridster.remove_widget($(this).parent());
    });
    resizeItem(mymap.parent());
}

//ajout d'un widget SIGMap de la grille, ce widget peut-être aussi supprimé de la grille
function newSIGMap() {
    var neww = newWidgetSIGMap();
    var newli = neww.li;
    var id = neww.id;
    gridster.add_widget(newli, 2, 2);

    var mymap = $("#" + id);
    mymap.mousedown(function (event) {
        event.stopPropagation();
    });
    mymap.next().click(function () {
        gridster.remove_widget($(this).parent());
    });
    resizeItem(mymap.parent());
}

function getDataByPeriod(layerValue,deviceID, canalID, dateDebut, dateFin, typeOfData, xaxis_title, yaxis_title, line_color) {
    var ncaurl = "https://scows.nicecotedazur.org/services/1.2/REST/getDataByPeriod/" + deviceID + "/" + canalID + "/" + dateDebut + "/" + dateFin;
    // var auth = '{ "login": "MadouzaT", "password": "Nlro1LMe5eBoe5G9eZ" }';
    console.log(ncaurl);
    var graph_title = layerValue + ' - ' + typeOfData;

    // var xhttp = new XMLHttpRequest();
    // xhttp.open("POST", ncaurl, true);
    // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(auth);
    // var response = JSON.parse(xhttp.response);
    // console.log(JSON.stringify(response));

    // jQuery.ajax({
    //     type: "POST",
    //     url: ncaurl,
    //     contentType: "application/json; charset=utf-8",
    //     headers: { "Access-Control-Request-Headers": "x-requested-with" },
    //     dataType: "json",
    //     data: JSON.stringify(auth),
    //     crossDomain: true,
    //     processData: false,
    //     success: function (result) {
    //         console.log("succes");
    //     },

    //     error: function (error) {
    //         console.log("error");
    //     }

    // });

    jQuery.ajax({
        async: true,
        crossDomain: true,
        url: ncaurl,
        method: "POST",
        headers: {"content-type": "application/json"},
        processData: false,
        data: "{\"login\":\"Madouza\",\n\"password\":\"Ph5dFf265LhgfdH1Jg\"}",
        success: function (result) {
            console.log("succes");
        },
        error: function (error) {
            console.log("error");
        }
    }).done(function (response) {
        var datas=response.elaboratedData[0].basicDataValue;
        var values=[];
        var times=[];
      
        function compare(a,b) {
        //   if (Date.parse(a.canalTime.Value) < Date.parse(b.canalTime.Value))
        //     return -1;
        //   if (Date.parse(a.canalTime.Value) > Date.parse(b.canalTime.Value))
        //     return 1;
        //   return 0;
            var diff = Date.parse(a.canalTime.Value) - Date.parse(b.canalTime.Value);
            return diff;
        }
        datas.sort(compare);
        
        for (j = 0; j < datas.length; j++) {
            
          var time;
          var value;
          if(datas[j].canalTime==null){
            time=null;
          } 
          
          if(datas[j].canalTime!=null){
            time=datas[j].canalTime.Value;
          }

        //   var time=moment(datas[j].canalTime.Value).format('LT');
          times.push(time);

          if(datas[j].sensorValue==null){
            value = null;
          }

          if(datas[j].sensorValue!=null){
            value = datas[j].sensorValue.text;
          }
          
          values.push(value);
          console.log("time:" + time + " value:" +  value);
        };
        newCapteurPlot(times,values, graph_title, xaxis_title, yaxis_title,line_color);
    });
}


function newCapteurTimeSeries(x_data, y_data, graph_title, xaxis_title, yaxis_title, line_color) {
    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);

    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });

    // Plotly.d3.csv("csv/finance-charts-apple.csv", function (err, rows) {

    //     function unpack(rows, key) {
    //         return rows.map(function (row) {
    //             return row[key];
    //         });
    //     }

        var trace = {
            type: "scatter",
            mode: "lines",
            name: yaxis_title,
            x: x_data,
            y: y_data,
            line: {
                color: line_color
            }
        };

        var data = [trace];

        var layout = {
            title: graph_title,
            width: $("#" + id).parent().innerWidth() - item_padding,
            height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding
        };

        Plotly.newPlot(id, data, layout);
    // });
}

function newTimeSeries() {
    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);

    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });

    Plotly.d3.csv("csv/finance-charts-apple.csv", function (err, rows) {

        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL High',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.High'),
            line: {
                color: '#17BECF'
            }
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL Low',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.Low'),
            line: {
                color: '#7F7F7F'
            }
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'Basic Time Series',
            width: $("#" + id).parent().innerWidth() - item_padding,
            height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding
        };

        Plotly.newPlot(id, data, layout);
    });
}


function newCapteurPlot( x_data, y_data, graph_title, xaxis_title, yaxis_title, line_color){
    
    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);

    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });

    
    var data = [{
        x: x_data,
        y: y_data,
        mode: 'lines',
        line: {
            color: line_color
        }
    }];
    var layout = {
      title: graph_title,
      width: $("#" + id).parent().innerWidth() - item_padding,
      height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding, 
      xaxis: {
        title: xaxis_title
      },
      yaxis: {
        title: yaxis_title,
        rangemode: 'tozero',
        autorange: true
      }
    };
    Plotly.newPlot(id, data, layout);
    resizeItem($("#" + id).parent());
}

function liveDataPlot() {

    var neww = newWidgetPlot("aqv-plot");
    var newli = neww.li;
    var id = neww.id;

    gridster.add_widget(newli, 2, 2);
    $("#" + id).next().click(function () {
        gridster.remove_widget($(this).parent());
    });
    var time = new Date();

    var data = [{
        x: [time],
        y: [Math.random()],
        mode: 'lines',
        line: {
            color: '#80CAF6'
        }
    }];

    var layout = {
        title: 'Basic Live Data',
        width: $("#" + id).parent().innerWidth() - item_padding,
        height: $("#" + id).parent().innerHeight() - aqv_remove_height - item_padding
    };

    Plotly.plot(id, data, layout);
    resizeItem($("#" + id).parent());
    var cnt = 0;

    var interval = setInterval(function () {

        var time = new Date();

        var update = {
            x: [[time]],
            y: [[Math.random()]]
        };

        Plotly.extendTraces(id, update, [0]);

        if (cnt === 100)
            clearInterval(interval);
    }, 1000);
}

$(document).ready(function () {
    // affichage de l'heure
    setInterval(function () {
        var now = new Date();
        $("#dateGMT").text(now.toString());
        $("#dateUTC").text(now.toGMTString());
    }, 1000);

    // right menu bindings
    $("#aqv-liveDataPlot").click(liveDataPlot);
    $("#aqv-timeSeriesPlot").click(newTimeSeries);
    $("#aqv-newRadar").click(newRadar);
    $("#aqv-newSIGMap").click(newSIGMap);
    $("#aqv-resize2x3").click(resize2x3);
    $("#aqv-resize3x3").click(resize3x3);
    $("#aqv-resize3x4").click(resize3x4);

    gridster = $(".gridster ul").gridster({
        widget_base_dimensions: [bloc_width, bloc_height],
        // max_cols: cols_max,
        widget_margins: [gutter, gutter],
        resize: {
            enabled: true,
            start: function (x, y, z) {
                z.find('.aqv-item').hide();
            },
            stop: function (x, y, z) {
                z.find('.aqv-item').show();
                resizeItem(z);
            }
        }
    }).data('gridster');

    resizeAll();

    $(".aqv-remove").click(function () {
        gridster.remove_widget($(this).parent());
    });

    $.sidebarMenu($('.sidebar-menu'));
    $.sidebarMenu($('.sidebar-menu-rtl'));

    $('#menu-button').click(function () {
        $('.animate-menu-right').toggleClass('animate-menu-open');
    })
});
