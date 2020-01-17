/* --------------------------------- */
/* ALBUM */
/* --------------------------------- */

{
    function smokePulser(context, w, h){
        this.w = w
        this.h = h
        this.ctx = context
        this.machine = SmokeMachine(context, "#111111");
        this.continue = false;
        this.smoke = 15;
        this.start = function(){
            this.machine.start()
            this.continue = true
            this.pulse()
        };
        this.pulse = function(){
            this.machine.addSmoke(this.w/2,this.h+100, this.smoke);
            var _this = this
            if(this.continue) setTimeout(function(){_this.pulse()}, 1500)
            else this.machine.stop();
        };
        this.stop = function(){
            this.continue = false
        };
        this.changeColor = function(color){
            this.machine = SmokeMachine(this.ctx, color);
            this.machine.start()
        }
    }


    d3.json("datasets/Roipancakes_processed.json", function(json){
        json.sort((a, b) => (a[1].co2_spotify < b[1].co2_spotify) ? 1 : -1)

        /* PARTIE ALBUM */
        var selection = 0

        var width = 1800
        var height = 645

        var w_canvas = 150
        var h_canvas = 450

        var margin_left = 400
        var margin_top = 10

        var expended = false

        var svg = d3.select(".body-album")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var bar_spotify = svg.append("g")
        var bar_spotify_cmp = svg.append("g")
        var bar_demat = svg.append("g")
        var bar_cd = svg.append("g")

        var scaleSmoke = d3.scaleLinear()
            .range([5, 15])
            .domain([0,10000])
        var y = d3.scaleLinear()
            .range([0, h_canvas])
            .domain([100,0]);
        var yAxisLeft = d3.axisLeft(y).tickSize(-10);
        var yAxisRight = d3.axisLeft(y).tickSize(10);

        /* LINE CHART */
        var margin_linechart = {top: 10, right: 180, bottom: 30, left: 60},
            width_linechart = 700 - margin_linechart.left - margin_linechart.right,
            height_linechart = 400 - margin_linechart.top - margin_linechart.bottom;
        var h_svg_linechart = height_linechart + margin_linechart.top + margin_linechart.bottom;
        var svg_linechart = d3.select(".body-album")
            .append("svg")
            .attr("width", width_linechart + margin_linechart.left + margin_linechart.right)
            .attr("height", 0)
            .append("g")
            .attr("transform", "translate(" + margin_linechart.left + "," + margin_linechart.top + ")");
        svg_linechart.append("rect")
            .attr("x", 0)
            .attr("y",0)
            .attr("width",width_linechart)
            .attr("height", height_linechart)
            .attr("fill", "white")
        var x_linechart = d3.scaleLinear()
            .range([0,width_linechart]);
        svg_linechart.append("g")
            .attr("transform", "translate(0," + height_linechart + ")")
            .call(d3.axisBottom(x_linechart))
            .classed("x",true);
			
		// text label for the x axis
		svg_linechart.append("text")             
		    .attr("transform", 
			"translate(" + (width_linechart/2) + " ," + 
			(height_linechart + margin_linechart.top + 20) + ")")
			.style("text-anchor", "middle")
			.text("Mois");

        var y_linechart = d3.scaleLinear()
            .range([height_linechart,0]);
        svg_linechart.append("g")
            .call(d3.axisLeft(y_linechart))
            .classed("y",true);


        var line_demat = svg_linechart.append("line")
            .attr("fill", "none")
            .attr("stroke", "#ff8a0c")
            .attr("stroke-width", 1.5)

        var line_cd = svg_linechart.append("line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 1.5)

        var line_spot = svg_linechart.append("line")
            .attr("fill", "none")
            .attr("stroke", "#00f669")
            .attr("stroke-width", 1.5)

        var line_spot_bis = svg_linechart.append("line")
            .attr("fill", "none")
            .attr("stroke", "#00f669")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", 2.5)

        var cross_demat = svg_linechart.append("circle")
            .attr("r", "4px")
            .attr("fill", "#ff8a0c")

        var cross_cd = svg_linechart.append("circle")
            .attr("r", "4px")
            .attr("fill", "grey");

        // create a tooltip
        var tooltip_cd = svg_linechart
            .append("foreignObject")
            .attr("width", 150)
            .attr("height", 100)
            .append("xhtml:div")
            .classed("tooltip-cross", true)
            .style("position", "absolute")
            .style("opacity", 0)

        var tooltip_demat = svg_linechart
            .append("foreignObject")
            .attr("width", 150)
            .attr("height", 100)
            .append("xhtml:div")
            .classed("tooltip-cross", true)
            .style("position", "absolute")
            .style("opacity", 0)


        /* ALBUM */
        function createBar(parentNode, nom){
            parentNode.append('line')
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("x1", margin_left)
                .attr("y1", 10+h_canvas)
                .attr("x2", margin_left+w_canvas)
                .attr("y2", 10+h_canvas);
            var foreignObject = parentNode.append("foreignObject")
                .attr("width", w_canvas)
                .attr("height",h_canvas)
                .attr("x",margin_left)
                .attr("y",margin_top)
            var foBody = foreignObject.append("xhtml:body")
                .style("margin", "0px")
                .style("padding", "0px")
                .style("background-color", "none")
                .style("width", w_canvas + "px")
                .style("height", h_canvas + "px")
                .style("position", "relative")
            var canvas = foBody.append("canvas")
                .attr("id", "canvas")
                .attr("width", w_canvas)
                .attr("height", h_canvas)
                .style("width",w_canvas+"px")
                .style("height",h_canvas+"px")
            var mask = foBody.append("div")
                .attr("class", "mask")

            parentNode.append("g")
                .attr("class", "y axis left")
                .call(yAxisLeft)
                .attr("transform", "translate("+margin_left+","+margin_top+")");
            var yaxis_right_x = margin_left+w_canvas;
            parentNode.append("g")
                .attr("class", "y axis right notext")
                .call(yAxisRight)
                .attr("transform", "translate("+yaxis_right_x+","+margin_top+")")
            parentNode.append("text")
                .text(nom)
                .attr("x", margin_left)
                .attr("y", 30+h_canvas)
                .attr("class", "support")
        }

        createBar(bar_spotify, "Spotify")
        createBar(bar_spotify_cmp, "Spotify")
        createBar(bar_demat, "Dématérialisé")
        createBar(bar_cd, "CD")
        bar_spotify.append("text")
            .attr("transform", "rotate(-90), translate(-270,"+(margin_left- 40)+")")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "medium")
            .text("g de Co2 émit");

        bar_spotify.select(".support")
            .attr("stroke", "#00f669")
        bar_spotify_cmp.select(".support")
            .attr("stroke", "#00f669")
        bar_demat.select(".support")
            .attr("stroke", "#ff8a0c")
        bar_spotify.select(".mask")
            .classed("spotify", true)
        bar_spotify_cmp.select(".mask")
            .classed("spotify", true)
        bar_demat.select(".mask")
            .classed("demat", true)

        bar_spotify_cmp.append("image")
            .attr("xlink:href", "https://cdn.shopify.com/s/files/1/0005/2751/products/gladsaxframe_large.JPG?v=1439211670")
            .attr("width", 144)
            .attr("height", 146)
            .attr("x", 213)
            .attr("y", h_canvas+37)



        bar_spotify_cmp.append("text")
            .attr("id", "title-cmp")
            .attr("x", 225)
            .attr("y", h_canvas+50+140)
        bar_spotify_cmp.append("image")
            .attr("id", "cover-cpm")
            .attr("xlink:href", "")
            .attr("width", 120)
            .attr("height", 120)
            .attr("x", 225)
            .attr("y", h_canvas+50)
            .on("click", function(){
                a_id = Number(d3.select(this).attr("data-aid"))
                updateAlbum(json[a_id])
            });

        var album_cover = svg.append("g")
                .attr("transform", "translate(0,50)");

        var cover_size = 300
        var y_img = 15

        album_cover.append("image")
            .attr("xlink:href", "https://cdn.shopify.com/s/files/1/0005/2751/products/gladsaxframe_large.JPG?v=1439211670")
            .attr("width", cover_size+61)
            .attr("height", cover_size+61)
            .attr("x", (w_canvas+margin_left) +19)
            .attr("y", y_img-30)

        var next = album_cover.append("g").attr("viewBox", "0 0 42 42")
            .attr("transform", "translate("+(margin_left+w_canvas+cover_size+10)+","+(y_img+cover_size+20)+")")

        next.append("path").attr("d", "M35.5,0c-0.552,0-1,0.447-1,1v18.095L7.068,0.177C6.762-0.034,6.364-0.057,6.035,0.114C5.706,0.287,5.5,0.628,5.5,1v40	c0,0.372,0.206,0.713,0.535,0.886C6.181,41.962,6.341,42,6.5,42c0.199,0,0.397-0.06,0.568-0.177L34.5,22.905V41c0,0.553,0.448,1,1,1 s1-0.447,1-1V1C36.5,0.447,36.052,0,35.5,0z")


        var prec = album_cover.append("g").attr("viewBox", "0 0 42 42")
            .attr("transform", "translate("+(margin_left+w_canvas+88)+","+(y_img+cover_size+20)+"), scale(-1,1)")

        prec.append("path")
            .attr("d", "M35.5,0c-0.552,0-1,0.447-1,1v18.095L7.068,0.177C6.762-0.034,6.364-0.057,6.035,0.114C5.706,0.287,5.5,0.628,5.5,1v40	c0,0.372,0.206,0.713,0.535,0.886C6.181,41.962,6.341,42,6.5,42c0.199,0,0.397-0.06,0.568-0.177L34.5,22.905V41c0,0.553,0.448,1,1,1 s1-0.447,1-1V1C36.5,0.447,36.052,0,35.5,0z")

        var a_id = 0;

        next.on("mouseover", function(){
            d3.select(this).style("cursor", "pointer");
            next.transition().duration(150).attr("transform", "translate("+(margin_left+w_canvas+cover_size+10)+","+(y_img+cover_size+15)+"), scale(1.25)")
        });

        next.on("mouseout", function(){
            next.transition().duration(150).attr("transform", "translate("+(margin_left+w_canvas+cover_size+10)+","+(y_img+cover_size+20)+")")
        });

        prec.on("mouseover", function(){
            d3.select(this).style("cursor", "pointer");
            prec.transition().duration(150).attr("transform", "translate("+(margin_left+w_canvas+88)+","+(y_img+cover_size+15)+"), scale(-1,1), scale(1.25)")
        });

        prec.on("mouseout", function(){
            prec.transition().duration(150).attr("transform", "translate("+(margin_left+w_canvas+90)+","+(y_img+cover_size+20)+"), scale(-1,1)")
        });

        next.on("click", function() {
            if(a_id < json.length){
                a_id += 1
                updateAlbum(json[a_id])
            }
        })

        prec.on("click", function() {
            if(a_id!==0){
                a_id -= 1
                updateAlbum(json[a_id])
            }
        })

        var text_aid = album_cover.append("text")
            .attr("x", (w_canvas+margin_left) + 50 + (cover_size-40)/2)
            .attr("y", y_img + cover_size + 51)
            .attr("font-size", "24px")

        var text_titre = album_cover.append("text")
            .attr("x", (w_canvas+margin_left) + cover_size + 80)
            .attr("y", y_img + 50)
            .attr("font-size", "30px")
            .text("Titre")

        var text_artiste = album_cover.append("text")
            .attr("x", (w_canvas+margin_left) + cover_size + 80)
            .attr("y", y_img + 50 + 50)
            .attr("font-size", "24px")
            .text("Artiste")




        var ctx = bar_spotify.select("canvas").node().getContext('2d')
        var spotify_smoke = new smokePulser(ctx, w_canvas, h_canvas)
        updateAlbum(json[a_id])
        ctx = bar_spotify_cmp.select("canvas").node().getContext('2d')
        var spotify_smoke_cmp = new smokePulser(ctx, w_canvas, h_canvas)
        ctx = bar_cd.select("canvas").node().getContext('2d')
        var cd_smoke = new smokePulser(ctx, w_canvas, h_canvas)
        ctx = bar_demat.select("canvas").node().getContext('2d')
        var demat_smoke = new smokePulser(ctx, w_canvas, h_canvas)

        //Définit la fumée en fonction du support
        spotify_smoke.changeColor([0,246,105])
        spotify_smoke_cmp.changeColor([0,246,105])
        spotify_smoke.start()
        spotify_smoke_cmp.start()
        demat_smoke.start()
        cd_smoke.start()
        bar_spotify_cmp.attr("style", "opacity:0;")
        bar_cd.attr("style", "opacity:0;")
        bar_demat.attr("style", "opacity:0;")
        //setTimeout(function(){
        //}, 5000);

        var value_cmp = 0;	
        //Fonction mettant à jour l'album
        function updateAlbum(album){

            text_titre.text(album[0])
            text_artiste.text(album[1].artiste)
            text_aid.text((a_id+1)+"/"+json.length)
            var old_img = album_cover.selectAll(".cover")
            var new_img = album_cover.append("image")
                .attr("class", "cover")
                .attr("style","opacity: 0;")
                .attr("xlink:href", album[1].image)
                .attr("width", cover_size)
                .attr("height", cover_size)
                .attr("x", (w_canvas+margin_left) + 50)
                .attr("y", y_img)
            old_img.transition().duration(500).ease(d3.easeLinear).attr("style","opacity: 0;")
                .on("end", function(){old_img.remove()})
            new_img.transition().duration(500).ease(d3.easeLinear).attr("style","opacity: 1;")

            if(expended===true) value = Math.max(album[1].co2_spotify, album[1].co2_cd, album[1].co2_demat)
            else value = album[1].co2_spotify
            //spotify_smoke.smoke = scaleSmoke(album[1].co2_spotify)
            if(compare===true)
                value = Math.max(value, value_cmp)

            y.domain([10,0])
            if(value>10)
                y.domain([20,0])
            if(value>20)
                y.domain([50,0])
            if(value>50)
                y.domain([100,0])
            if(value>100)
                y.domain([180,0])
            if(value>500)
                y.domain([1000,0])
            if(value>1000)
                y.domain([5000,0])
            if(value>5000)
                y.domain([10000,0])

            svg.selectAll(".y.left")
                .transition()
                .duration(500)
                .call(yAxisLeft)
            svg.selectAll(".y.right")
                .transition()
                .duration(500)
                .call(yAxisRight)
            if(compare){
                bar_spotify_cmp.select(".mask").attr("style", "height:"+y(album[1].co2_spotify)+"px")
                bar_spotify.select(".mask").attr("style", "height:"+y(value_cmp)+"px")
            }
            else
                bar_spotify.select(".mask").attr("style", "height:"+y(album[1].co2_spotify)+"px")
            bar_demat.select(".mask").attr("style", "height:"+y(album[1].co2_demat)+"px")
            bar_cd.select(".mask").attr("style", "height:"+y(album[1].co2_cd)+"px")
            //,"background-image: linear-gradient(rgba(255,255,255,1) 					   "+y(value)+"px,rgba(255,255,255,0)); height:"+(y(value)+15)+"px")
            updateLineChart(album)
        }

        //Code du bouton "Voir plus"
        var btn_expand = svg.append("foreignObject")
            .attr("width", 250)
            .attr("height", 50)
            .attr("style", "transition: 0.5s;")
            .attr("x",360)
            .attr("y",520)
        //.attr("transform", "translate(360,520)")
            .append("xhtml:button")
            .attr("class", "button is-dark is-medium")
            .text("Voir autres supports")

        //Code du bouton "Comparer"
        var btn_compare = album_cover.append("foreignObject")
            .attr("x", (w_canvas+margin_left) + cover_size/2 - 45)
            .attr("y", y_img + cover_size + 155)
            .attr("width", 200)
            .attr("height", 50)
            .attr("style", "transition: 0.5s;")
            .append("xhtml:button")
            .attr("class", "button is-dark is-medium")
            .text("Comparer album")

        //Permet de comparer deux albums
        var compare = false
        btn_compare.on("click", function(){
            if(expended===true)
                closeExpend(btn_expand.node())
            if(compare===true){
                stopCompare()
            } else {
                svg.select("#title-cmp")
                    .text(json[a_id][0])
                svg.select("#cover-cpm")
                    .attr("xlink:href", json[a_id][1].image)
                    .attr("data-aid", a_id)
                d3.select(btn_expand.node().parentNode).transition()
                    .duration(1000)
                    .attr("transform", "translate(40,0)")
                d3.select(btn_compare.node().parentNode).transition()
                    .duration(1000)
                    .attr("transform", "translate(40,0)")
                updateAlbum(json[a_id])
                value_cmp = value
                compare = true
                d3.select(this)
                    .attr("class", "button is-medium")
                    .text("Réduire")
                compare = true
                bar_spotify_cmp.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("style", "opacity:1;")
                bar_spotify.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("style", "opacity:1;")
                    .attr("transform", "translate("+ ((-1)*(w_canvas+40)) +",0)");
            }
            updateAlbum(json[a_id])

        });

        //Fonction qui permet d'arrêter de comaprer deux albums
        function stopCompare(){
            d3.select(btn_expand.node().parentNode).transition()
                .duration(1000)
                .attr("transform", "translate(0,0)")
            d3.select(btn_compare.node().parentNode).transition()
                .duration(1000)
                .attr("transform", "translate(0,0)")
            compare = false
            btn_compare
                .attr("class", "button is-medium is-black")
                .text("Comparer album")
            bar_spotify_cmp
                .transition()
                .duration(500)
                .ease(d3.easeQuadOut)
                .attr("style", "opacity:0;")
            bar_spotify.transition()
                .duration(1000)
                .ease(d3.easeQuadOut)
                .attr("style", "opacity:1;")
                .attr("transform", "translate(0,0)");
        }

        //Fonction du bouton "voir plus"
        btn_expand.on("click", function(){
            if(compare===true)
                stopCompare()
            if(expended===false){
                d3.select(svg_linechart.node().parentNode).transition()
                    .duration(1000)
                    .attr("height", h_svg_linechart)

                d3.select(this.parentNode)
                    .transition()
                    .duration(1000)
                    .attr("transform", "translate(-85,0)")
                d3.select(this)
                    .attr("class", "button is-medium")
                    .text("Réduire")
                expended=true
                album_cover.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("transform", "translate(" + w_canvas + ",50)")

                //spotify_smoke.changeColor([20,120,20])
                spotify_smoke.changeColor([0,246,105])
                //demat_smoke.changeColor([120,20,20])
                demat_smoke.changeColor([255,138,12])
                cd_smoke.changeColor("#111111")
                bar_spotify.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("style", "opacity:1;")
                    .attr("transform", "translate("+ ((-2)*(w_canvas+40) + 50) +",0)");
                bar_demat.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("style", "opacity:1;")
                    .attr("transform", "translate("+ ((-1)*(w_canvas+40) + 50) +",0)");
                bar_cd.transition()
                    .duration(1000)
                    .ease(d3.easeQuadOut)
                    .attr("style", "opacity:1;")
                    .attr("transform", "translate("+ (0*(w_canvas+40) + 50) +",0)");
            } else {
                closeExpend(this) 
            }
            updateAlbum(json[a_id])
        });

        //Fermeture de l'extension permettant de comparer/voir plus de supports
        function closeExpend(btn){
            d3.select(svg_linechart.node().parentNode).transition()
                .duration(1000)
                .attr("height", 0)

            d3.select(btn.parentNode)
                .transition()
                .duration(1000)
                .attr("transform", "translate(0,0)")
            d3.select(btn)
                .attr("class", "button is-dark is-medium")
                .text("Voir autres supports")
            //spotify_smoke.changeColor("#111111")
            spotify_smoke.changeColor([0,246,105])
            expended=false
            bar_spotify.transition()
                .duration(1000)
                .ease(d3.easeQuadOut)
                .attr("transform", "translate(0,0)")

            bar_demat.transition()
                .duration(1000)
                .ease(d3.easeQuadOut)
                .attr("style", "opacity:0;")
                .attr("transform", "translate(0,0)")
            bar_cd.transition()
                .duration(1000)
                .ease(d3.easeQuadOut)
                .attr("style", "opacity:0;")
                .attr("transform", "translate(0,0)")
            //.on("end", function() {cd_smoke.stop()})
            album_cover.transition()
                .duration(1000)
                .ease(d3.easeQuadOut)
                .attr("transform", "translate(0,50)")

        }
        //Parcours des albums avec les flèches
        d3.select("body")
            .on("keydown", function() {
                if(d3.event.keyCode === 37){
                    if(a_id!==0){
                        a_id -= 1
                        updateAlbum(json[a_id])
                    }
                } else if(d3.event.keyCode === 39) {
                    if(a_id < json.length){
                        a_id += 1
                        updateAlbum(json[a_id])
                    }
                }
            });

        /* LINE CHART */
        function updateLineChart(album){
            var spot = album[1].co2_spotify
            var demat = album[1].co2_demat
            var cd = album[1].co2_cd
            x_linechart.domain([0,Math.ceil(cd/spot)+1])
            y_linechart.domain([0,Math.ceil(cd)+10])
            line_demat
                .transition()
                .duration(500)
                .attr("x1", x_linechart(0))
                .attr("y1",y_linechart(demat))
                .attr("x2",x_linechart(Math.ceil(cd/spot)+1))
                .attr("y2",y_linechart(demat));
            line_cd
                .transition()
                .duration(500)
                .attr("x1", x_linechart(0))
                .attr("y1",y_linechart(cd))
                .attr("x2",x_linechart(Math.ceil(cd/spot)+1))
                .attr("y2",y_linechart(cd))
            line_spot
                .transition()
                .duration(500)
                .attr("x1", x_linechart(0))
                .attr("y1",y_linechart(0))
                .attr("x2",x_linechart(1))
                .attr("y2",y_linechart(spot))
            line_spot_bis
                .transition()
                .duration(500)
                .attr("x1",x_linechart(1))
                .attr("y1",y_linechart(spot))
                .attr("x2", x_linechart(Math.ceil(cd/spot)+1))
                .attr("y2",y_linechart(spot * (Math.ceil(cd/spot)+1)))
            cross_demat
                .transition()
                .duration(500)
                .attr("cx", x_linechart(demat/spot))
                .attr("cy", y_linechart(demat))
            cross_cd
                .transition()
                .duration(500)
                .attr("cx", x_linechart(cd/spot))
                .attr("cy", y_linechart(cd))
            d3.select(tooltip_cd.node().parentNode)
                .transition()
                .duration(500)
                .attr("x", x_linechart(cd/spot))
                .attr("y", y_linechart(cd))
            tooltip_cd
                .text("Croisement au bout de " + Math.ceil(cd/spot) +" mois.");
            d3.select(tooltip_demat.node().parentNode)
                .transition()
                .duration(500)
                .attr("x", x_linechart(demat/spot))
                .attr("y", y_linechart(demat))
            tooltip_demat
                .text("Croisement au bout de " + Math.ceil(demat/spot) +" mois.");
            svg_linechart.select(".y")
                .transition()
                .duration(500)
                .call(d3.axisLeft(y_linechart))
            svg_linechart.select(".x")
                .transition()
                .duration(500)
                .call(d3.axisBottom(x_linechart))
        }

        svg_linechart.on("mousemove", function(e){
            var spot = json[a_id][1].co2_spotify
            var demat = json[a_id][1].co2_demat
            var cd = json[a_id][1].co2_cd

            var mx = d3.mouse(this)[0];
            var my = d3.mouse(this)[1];
            if(eucl(mx, my, x_linechart(cd/spot), y_linechart(cd)) > eucl(mx, my, x_linechart(demat/spot), y_linechart(demat))){
                cross_demat.attr("r", "6px")
                    .attr("fill", "red");
                cross_cd.attr("r", "4px")
                    .attr("fill", "grey");
                tooltip_cd.transition()		
                    .duration(50)		
                    .style("opacity", 0);
                tooltip_demat.transition()		
                    .duration(50)		
                    .style("opacity", 1);

            }else{
                cross_cd.attr("r", "6px")
                    .attr("fill", "red");
                cross_demat.attr("r", "4px")
                    .attr("fill", "#ff8a0c");
                tooltip_demat.transition()		
                    .duration(50)		
                    .style("opacity", 0);
                tooltip_cd.transition()		
                    .duration(50)		
                    .style("opacity", 1);
            }
        });

        svg_linechart.on("mouseout", function(){
            tooltip_demat.transition()		
                .duration(50)		
                .style("opacity", 0);
            tooltip_cd.transition()		
                .duration(50)		
                .style("opacity", 0);
            cross_cd.attr("r", "4px")
                .attr("fill", "grey");
            cross_demat.attr("r", "4px")
                .attr("fill", "#ff8a0c");
        });

        function eucl(x1, y1, x2, y2){
            return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1,2))
        }

    });
}
/* --------------------------------- */
/* HISTO */
/* --------------------------------- */
{
    dataset = "./datasets/Qcharton_processed.json"
    load_data() 

    //L'histogramme est chargé dès lors qu'on a suffisemment scroll
    var scrolling = window.scrollY;
    var loaded = false
    if(scrolling > 1000){
        load_histo()
        loaded = true
    } else {
        var cllbck = function(e) {
            scrolling = window.scrollY;
            if(scrolling > 1000 && !loaded){
                load_histo()
                loaded = true
                window.removeEventListener("scroll", cllbck)
            }
        }
        window.addEventListener('scroll', cllbck);
    }


    const margin = {top: 30, right: 20, bottom: 90, left: 120},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var final_data

    var graphes;
    var deleted = true;

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0])

    //Crée l'histogrammme dans le div correspondant
    const svg = d3.select(".body-hist").append("svg")
        .attr("id", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var g = d3.select("svg")
        .append("g")

    const div = d3.select(".body-hist").append("div")
        .attr("class", "tooltip")         
        .style("opacity", 0);

    var final_data = [];


    //Fonction permettant de charger les données
    function load_data() {
        d3.json(dataset, function(data) {

            //Calcul de la quantité totale de CO2 produite
            co2 = [0, 0, 0]
            noms = ["Physique", "Dématérialisé", "Spotify"]
            for(var i = 0; i<data.length; i++){
                co2[0] += data[i][1].co2_cd
                co2[1] += data[i][1].co2_demat
                co2[2] += data[i][1].co2_spotify
            }
            final_data = [{"nom": noms[0], "valeur": Math.floor(co2[0])},
                {"nom": noms[1], "valeur": Math.floor(co2[1])},
                {"nom": noms[2], "valeur": Math.floor(co2[2])}];

            x.domain(final_data.map(function(d, i) { return d.nom; }));
            y.domain([0, d3.max(final_data, function(d) { return d.valeur; })+150]);


            svg.selectAll("text").remove()
            deleted = false;

            //Création de l'axe X
            let axx = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0))

            //Label des barres
            axx.selectAll("line").attr("stroke","white")
            axx.selectAll("path").attr("stroke","white")
            axx.selectAll("text")
                .attr("font-size", "large")
                .attr("fill","white")
                .attr("transform", "translate(-75, 8)");

            //Création de l'axe Y
            let axy = svg.append("g")
                .call(d3.axisLeft(y));
            axy.selectAll("line").attr("stroke","white")
            axy.selectAll("path").attr("stroke","white")
            axy.selectAll("text")
                .attr("fill","white")
                .attr("transform", "translate(-10,0)")
                .attr("font-size", "large");

            //Label de l'axe Y
            svg.append("text")
                .attr("transform", "rotate(-90), translate(0, -25)")
                .attr("y", 32 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .attr("font-size", "large")
                .style("text-anchor", "middle")
                .attr("fill","white")
                .text("g de Co2 émit");

        });
    }

    //Fonction qui charge les barres des histogrammes
    function load_histo(){
        d3.json(dataset, function(data) {
            width_r = 100


            graphes = svg.selectAll(".graph")
                .data(final_data);


            var bar = graphes.enter()
                .append("g")

            //Création des barres avec le mouseover
            bar.append("rect")
                .attr("x", function(d){x_r = x(d.nom); return x(d.nom)})
                .attr("y", function(d){y_r = y(0); return y(0);})
                .attr("width", width_r)
                .attr("height", function(d){return 0;})
                .attr("fill", function(d)
                    {if(d.nom === "Spotify"){
                        return "#00f669"
                    }
                        if(d.nom === "Physique"){
                            return "#c0c7c3"
                        }
                        if(d.nom === "Dématérialisé"){
                            return "#ff8a0c"
                        }
                    })
                .on("mousemove", function(d) {
                    div.transition()        
                        .duration(100)      
                        .style("opacity", .9);
                    var mousePosition = d3.mouse(this);
                    div.attr('style', 'left:' + (mousePosition[0]+ 30) +
                        'px; top:' + (mousePosition[1]+ 90) + 'px')
                        .html("Equivaut à " + Math.round(d.valeur/data[0][1].co2_cd*100)/100 + " disque(s) physique");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()
                .duration(1500)
                .attr("height", function(d){return height-y(d.valeur);})
                .attr("y", function(d){return y(d.valeur);});
            //Affichage de la quantité de CO2 au dessu des barres  
            bar.append("text")
                .attr("x", function(d){x_r = x(d.nom); return x(d.nom)})
                .attr("y", function(d){y_r = y(0); return y(0);})
                .text(function(d){return d.valeur+" g"})
                .attr("fill", function(d)
                    {if(d.nom === "Spotify"){
                        return "#00f669"
                    }
                        if(d.nom === "Physique"){
                            return "#c0c7c3"
                        }
                        if(d.nom === "Dématérialisé"){
                            return "#ff8a0c"
                        }
                    })
                .attr("font-size", "1.15em")
                .style("opacity", 0)
                .transition()
                .duration(1500)
                .style("opacity", 1)
                .attr("height", function(d){return height-y(d.valeur);})
                .attr("y", function(d){return y(d.valeur);})
                .each(function(){
                    w_txt = (width_r - d3.select(this).node().getBBox().width)/2
                    d3.select(this)
                        .attr("transform", "translate("+w_txt+", -8)");
                });
        });
    }
}
