var correspondance_capteurs = new Array();
correspondance_capteurs['device_prefix'] = "ENVIRO-SPCMED-";
correspondance_capteurs['canal_suffix_waterlevel'] = "-h" //"Niveau d'eau"
correspondance_capteurs['canal_suffix_waterflow'] = "-q" //"Débit d'eau" 
correspondance_capteurs['Coubaisse'] = "Y612201001";
correspondance_capteurs['Pont de la Manda'] = "Y644202001";
correspondance_capteurs['Pont Napoléon III'] = "Y644201001";
correspondance_capteurs['La Clave'] = "Y643401001";
correspondance_capteurs['Pont de la Lune'] = "Y623402001";
correspondance_capteurs['Pont d\'Enaux'] = "Y600203001";
correspondance_capteurs['Rte Chap Ste Blaise'] = "Y622401001";
correspondance_capteurs['Pont du Cros'] = "Y633404001";
correspondance_capteurs['Pont Levis'] = "Y604201001";
correspondance_capteurs['Pont des Scaffarels'] = "Y603561001";
correspondance_capteurs['Pont du Coude'] = "Y642401001";

//menu associé à un point de la map SIG 
function openMenuCapteur(point,layerName) {
    var ptMenu = pointMenu(point,layerName);
    $(ptMenu).draggable({ zIndex: 50 });
    $("body").append(ptMenu);
    $.pointSidebarMenu($(ptMenu));    
    AnnulerMenu();
    OkMenuCapteur(point);
}

function openMenuModele(point, layerName) {
    var ptMenu = pointMenu(point,layerName);
    $(ptMenu).draggable({ zIndex: 50 });
    $("body").append(ptMenu);
    // $.pointSidebarMenu($('.sidebar-menu-2'));
    $.pointSidebarMenu($(ptMenu));
    AnnulerMenu();
    OkMenuModele(point);
}
var cptidmenu = 0;
function pointMenu(point, layerName) {
    var periode = periodeSubmenu("Période");
    var debit = waterParamSubmenu("Débit");
    var hauteur = waterParamSubmenu("Hauteur d'eau");
    var velocite = waterParamSubmenu("Vélocité");
    var concentration = waterParamSubmenu("Concentration Polluant");
    var menu = document.createElement("div");
    var splitArray;
    var idmenu = splitJoin(point,' ');
    idmenu = splitJoin(idmenu,'\'');
    
    if($('#'+idmenu)){
        cptidmenu = cptidmenu + 1;
        idmenu = idmenu + cptidmenu;
    }
    $(menu).attr('id', idmenu);
    $(menu).addClass("animatemenu");
    $(menu).css({ "position": "fixed", "top": "50%", "left": "50%", "margin-top": "-120px", "margin-left": "-78px" });
    var menuEntete = document.createElement("p");
    $(menuEntete).append(layerName);
    $(menuEntete).addClass("entetePointMenu");
    $(menu).prepend($(menuEntete));
    var ulelemt = document.createElement("ul");
    $(ulelemt).addClass("sidebar-menu-2");
    $(ulelemt).append(periode);
    $(ulelemt).append(debit);
    $(ulelemt).append(hauteur);
    $(ulelemt).append(velocite);
    $(ulelemt).append(concentration);
    $(menu).append($(ulelemt));
    var boutonsdiv = document.createElement("div");
    $(boutonsdiv).addClass("centerbutton");
    $(boutonsdiv).append("<button id=\"okid" + idmenu + "\">OK</button> <button id=\"annulerid" + idmenu + "\">Annuler</button>");
    $(menu).append($(boutonsdiv));
    return $(menu);
}

function splitJoin(s, c){ // s==String and c==character
    if((typeof s=="string") && (s.search(c) != -1)){
       var  splitArray = s.split(c);
       s = splitArray.join("");
    }
    return s;
}

//sous-menu période
function periodeSubmenu(periode) {
    var lielemt = document.createElement("li");
    var ulelemt = document.createElement("ul");
    $(ulelemt).addClass("sidebar-submenu-2");
    var now = new Date();
    var dd = now.getDate();
    var mm = now.getMonth() + 1;
    var yyyy = now.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var aujourdHui = yyyy + '-' + mm + '-' + dd;
    $(ulelemt).append("<br><li><div>Début: Date <input type=\"date\" name=\"dateDebut\" value=\"" + aujourdHui + "\"></div></li><br><li><div>Fin: Date <input type=\"date\" name=\"dateFin\" value=\"" + aujourdHui + "\"><br></div></li>");
    $(lielemt).append("<a href=\"#\">" + periode + "</a>");
    $(lielemt).append($(ulelemt));
    return $(lielemt);
}

//sous-menu paramètre pour faire le plot
function waterParamSubmenu(waterParam) {
    var lielemt = $("<li></li>");
    var ulelemt = $("<ul></ul>");
    $(ulelemt).addClass("sidebar-submenu-2");
    $(ulelemt).append("<li><a href=\"#\">Plots</a></li><li><input type=\"checkbox\" class=\"" + waterParam.charAt(0).toLowerCase() + "-timeseries\"> Time series</li><li><input type=\"checkbox\" class=\"" + waterParam.charAt(0).toLowerCase() + "-liveplot\"> Live plot</li>");
    $(lielemt).append("<a href=\"#\">" + waterParam + "</a>");
    $(lielemt).append($(ulelemt));
    return $(lielemt);
}


function treatSIGReturn(valueJson) {
    var obj = jQuery.parseJSON(valueJson);
    if ("returnValue" in obj) {
        var myObj = JSON.parse(obj.returnValue);
        var layerList = [];
        var jsonArr = myObj.aquavar;
        var jsonPt = JSON.stringify(myObj.point);
        for (i = 0; i < jsonArr.length; i++) {
            var _lyrId = jsonArr[i].layerID;
            var _lyrName = jsonArr[i].layer;
            var _lyrValue = jsonArr[i].ident;
            if ((_lyrName == "Capteurs") && (correspondance_capteurs.hasOwnProperty(_lyrValue))) {
                // alert("layerName : " + _lyrName + " layerValue : " + _lyrValue);
                openMenuCapteur(_lyrValue, _lyrName);
            }

            if (_lyrName == "Modèle"){
                openMenuModele(_lyrValue, _lyrName);
            }
        }
    }

    if ("codeAction" in obj) {
        var code = obj.codeAction;
        var lbl = obj.desc;
        alert("codeAction : " + code + "\nDescription : " + lbl);
    }

    if ("returnDate" in obj) {
        var _date = document.getElementById('the_date');
        var _time = document.getElementById('the_time');
        //var d = new Date(obj.returnValue);

        var d = obj.returnDate.split("T")[0];
        var t = obj.returnDate.split("T")[1];

        _date.value = d;
        _time.value = t;
    }

    if ("mapLoaded" in obj) {

    }

}

//annulation du menu
function AnnulerMenu() {
    $("button:contains('Annuler')").click(function () {
        var parent = $(this).parent();
        var grdParent = $(parent).parent();
        $(grdParent).remove();
    });
}

//lance les plots 
function OkMenuCapteur(ident) {
    $("button:contains('OK')").click(function () {
        var parent = $(this).parent();
        var grdParent = $(parent).parent();
        var grdParentId = $(grdParent).attr("id");
        var dateDebut = $("#" + grdParentId + " input[name=\"dateDebut\"]").val();
        var dateFin = $("#" + grdParentId + " input[name=\"dateFin\"]").val();
        var debitTimeSeries = $("#" + grdParentId + " .d-timeseries");
        var debitLivePlot = $("#" + grdParentId + " .d-liveplot");
        var hauteurDeauTimeSeries = $("#" + grdParentId + " .h-timeseries");
        var hauteurDeauLivePlot = $("#" + grdParentId + " .h-liveplot");
        var velociteTimeSeries = $("#" + grdParentId + " .v-timeseries");
        var velociteLivePlot = $("#" + grdParentId + " .v-liveplot");
        var concentrationTimeSeries = $("#" + grdParentId + " .c-timeseries");
        var concentrationLivePlot = $("#" + grdParentId + " .c-liveplot");
        
        if (debitTimeSeries.is(':checked')) {
            var deviceID = correspondance_capteurs['device_prefix'] + correspondance_capteurs[ident];
            var canalID = correspondance_capteurs[ident] + correspondance_capteurs['canal_suffix_waterflow'];
            var typeOfData = "Débit";
            var xaxis_title = "Temps";
            var yaxis_title = "Débit";
            var line_color = "#0000FF";

            if(dayDiff(dateFin, dateDebut) <= 6){
                getDataByPeriod(ident, deviceID, canalID, dateDebut, dateFin, typeOfData, xaxis_title, yaxis_title, line_color);
            }

            else{
                alert("la période choisie doit être inférieure ou égale à 6 jours, veuillez refaire votre sélection");
            }
        }

        if (hauteurDeauTimeSeries.is(':checked')) {
            var deviceID = correspondance_capteurs['device_prefix'] + correspondance_capteurs[ident];
            var canalID = correspondance_capteurs[ident] + correspondance_capteurs['canal_suffix_waterlevel'];
            var typeOfData = "Hauteur d'eau";
            var xaxis_title = "Temps";
            var yaxis_title = "Hauteur en mètres";
            var line_color = "#00FFFF";

            if(dayDiff(dateFin, dateDebut) <= 6){
                getDataByPeriod(ident, deviceID, canalID, dateDebut, dateFin, typeOfData, xaxis_title, yaxis_title, line_color);
            }

            else{
                alert("la période choisie doit être inférieure ou égale à 6 jours, veuillez refaire votre sélection");
            }
        }

        if (velociteTimeSeries.is(':checked')) {
            newTimeSeries();
        }

        if (concentrationTimeSeries.is(':checked')) {
            newTimeSeries();
        }

        if (debitLivePlot.is(':checked')) {
            liveDataPlot();
        }

        if (hauteurDeauLivePlot.is(':checked')) {
            liveDataPlot();
        }

        if (velociteLivePlot.is(':checked')) {
            liveDataPlot();
        }

        if (concentrationLivePlot.is(':checked')) {
            liveDataPlot();
        }

        $(grdParent).remove();
    });
}


function OkMenuModele(ident){
    $("button:contains('OK')").click(function () {
        var parent = $(this).parent();
        var grdParent = $(parent).parent();
        var grdParentId = $(grdParent).attr("id");
        var dateDebut = $("#" + grdParentId + " input[name=\"dateDebut\"]").val();
        var dateFin = $("#" + grdParentId + " input[name=\"dateFin\"]").val();
        var debitTimeSeries = $("#" + grdParentId + " .d-timeseries");
        var debitLivePlot = $("#" + grdParentId + " .d-liveplot");
        var hauteurDeauTimeSeries = $("#" + grdParentId + " .h-timeseries");
        var hauteurDeauLivePlot = $("#" + grdParentId + " .h-liveplot");
        var velociteTimeSeries = $("#" + grdParentId + " .v-timeseries");
        var velociteLivePlot = $("#" + grdParentId + " .v-liveplot");
        var concentrationTimeSeries = $("#" + grdParentId + " .c-timeseries");
        var concentrationLivePlot = $("#" + grdParentId + " .c-liveplot");

        // $.ajax( {
        //     type: "POST",
        //     url: './php/shape.php',
        //     data:{
        //         ident:ident,
        //         dateDebut:dateDebut,
        //         dateFin:dateFin
        //     },
        //     success: function(response) {
        //         console.log(response);
        //     },
        //     error: function(response) {
        //         console.log("error");
        //     }						
        // });
        // var shapefile = require("beta10 - Copie/node_modules/shapefile");
        // shapefile.open("example.shp")
        //   .then(source => source.read()
        //     .then(function log(result) {
        //       if (result.done) return;
        //       console.log(result.value);
        //       return source.read().then(log);
        //     }))
        //   .catch(error => console.error(error.stack));


        $(grdParent).remove();
    });
}
 

function dayDiff(dateDebut, dateFin){
  var dateDeb = Date.parse(dateDebut)/86400000;
  var dateFin = Date.parse(dateFin)/86400000;
  return Math.abs(dateFin - dateDeb);
}

