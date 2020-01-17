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
      var selection = 0
      
      var width = 1800
      var height = 600
      
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
      
		
      
      var album_cover = svg.append("g");

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
        }
      
		var btn_expand = svg.append("foreignObject")
      	.attr("width", 250)
      	.attr("height", 100)
        .attr("style", "transition: 0.5s;")
      	.attr("transform", "translate(360,520)")
      	.append("xhtml:button")
        .attr("class", "button is-dark is-medium")
        .text("Voir autres supports")

        var btn_compare = album_cover.append("foreignObject")
        .attr("x", (w_canvas+margin_left) + cover_size/2 - 45)
        .attr("y", y_img + cover_size + 90)
      	.attr("width", 250)
      	.attr("height", 100)
        .attr("style", "transition: 0.5s;")
      	.append("xhtml:button")
        .attr("class", "button is-dark is-medium")
        .text("Comparer album")

      var compare = false
      btn_compare.on("click", function(){
        if(expended===true)
            closeExpend(btn_expand.node())
        if(compare===true){
            stopCompare()
        } else {

            updateAlbum(json[a_id])
            value_cmp = value
            compare = true
           d3.select(this)
            .attr("class", "button is-medium")
            .text("Réduire")
            compare = true
            bar_spotify_cmp.attr("style", "opacity:1;")
            bar_spotify.transition()
             .duration(1000)
             .ease(d3.easeQuadOut)
             .attr("style", "opacity:1;")
             .attr("transform", "translate("+ ((-1)*(w_canvas+40)) +",0)");
        }
        updateAlbum(json[a_id])

      });
      function stopCompare(){
          compare = false
          btn_compare
              .attr("class", "button is-medium is-black")
              .text("Comparer album")
          bar_spotify_cmp
              .transition()
              .duration(1000)
              .ease(d3.easeQuadOut)
              .attr("style", "opacity:0;")
          bar_spotify.transition()
              .duration(1000)
              .ease(d3.easeQuadOut)
              .attr("style", "opacity:1;")
              .attr("transform", "translate(0,0)");
      }

      btn_expand.on("click", function(){
        if(compare===true)
          stopCompare()
        if(expended===false){
          d3.select(this.parentNode)
             .transition()
             .duration(1000)
      	    .attr("transform", "translate(275,520)")
          d3.select(this)
            .attr("class", "button is-medium")
            .text("Réduire")
          expended=true
          album_cover.transition()
             .duration(1000)
             .ease(d3.easeQuadOut)
                .attr("transform", "translate(" + w_canvas + ",0)")

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
      function closeExpend(btn){
          d3.select(btn.parentNode)
             .transition()
             .duration(1000)
      	    .attr("transform", "translate(360,520)")
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
             .attr("transform", "translate(0,0)")
       
      }
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
        
    	});
}
/* --------------------------------- */
/* HISTO */
/* --------------------------------- */
{
  dataset = "./datasets/Qcharton_processed.json"
  load_data() 
  setTimeout(load_histo, 2000)
  
const margin = {top: 20, right: 20, bottom: 90, left: 120},
  width = 1000 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  
  var final_data
  
  var graphes;
  var deleted = true;
  
  const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

  const y = d3.scaleLinear()
      .range([height, 0])
  
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
  
  function load_data() {
    d3.json(dataset, function(data) {
      
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
      
      /*svg.selectAll("rect").remove()
      svg.selectAll("g").remove()*/
      
          svg.selectAll("text").remove()
          deleted = false;

          let axx = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))

          axx.selectAll("line").attr("stroke","white")
          axx.selectAll("path").attr("stroke","white")
          axx.selectAll("text")
            .attr("font-size", "large")
            .attr("fill","white")
            .attr("transform", "translate(-75, 8)");

          let axy = svg.append("g")
           .call(d3.axisLeft(y));
          axy.selectAll("line").attr("stroke","white")
          axy.selectAll("path").attr("stroke","white")
           axy.selectAll("text")
            .attr("fill","white")
            .attr("transform", "translate(-10,0)")
            .attr("font-size", "large");
          // text label for the y axis
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
         
    
    function load_histo(){
      d3.json(dataset, function(data) {
          width_r = 100
          
          
         graphes = svg.selectAll(".graph")
        .data(final_data);
          
          
         var bar = graphes.enter()
        .append("g")
         
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
        .attr("transform", "translate(30, -5)")
        .style("opacity", 0)
        .transition()
        .duration(1500)
        .style("opacity", 1)
        .attr("height", function(d){return height-y(d.valeur);})
        .attr("y", function(d){return y(d.valeur);});
      
      
   });
  }
}


