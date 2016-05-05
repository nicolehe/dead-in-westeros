d3.json('/housesdata.json', function(housesData) {
    d3.json('/data.json', function(charData) {
        var deadChars = _.reject(charData, { 'died': "" });
        var aliveChars = _.where(charData, { 'died': "" });
        var deadCharsURLs = _.pluck(deadChars, 'url');
        var aliveCharsURLs = _.pluck(aliveChars, 'url');

        var mainHousesSwornMembers = {};



        _.each(housesData, function(house) {


            var numMembers = house.swornMembers.length;
            if (numMembers > 1) {
                mainHousesSwornMembers[house.name] = house.swornMembers;
            }

        });


        _.each(mainHousesSwornMembers, function(char, house) {

            deadNamesArr = [];
            aliveNamesArr = [];


            var deadInHouse = _.intersection(char, deadCharsURLs);
            var aliveInHouse = _.intersection(char, aliveCharsURLs);

            //console.log("There are " + deadInHouse.length + " dead, and " + aliveInHouse.length + " alive in " + house);
            _.each(deadInHouse, function(url) {
                _.each(deadChars, function(char) {
                    if (url == char.url) {
                        deadNamesArr.push(" " + char.name);
                    }
                });
            });




            _.each(aliveInHouse, function(url) {
                _.each(aliveChars, function(char) {
                    if (url == char.url) {
                        aliveNamesArr.push(" " + char.name);
                    }
                });
            });



            var tooltipDead = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .attr("class", "tooltipDead")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .html("<span style='color:#F7007C'><strong>" + deadInHouse.length + " dead:" + "</strong></span><span>" + deadNamesArr + "</span>");

            var tooltipAlive = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("class,", "tooltip")
                .attr("class", "tooltipAlive")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .html("<span style='color:#00F778'><strong>" + aliveInHouse.length + " alive:" + "</strong></span><span>" + aliveNamesArr + "</span>");



            var svgContainer = d3.select('#dataviz').append('svg')
                .attr('width', window.innerWidth)
                .attr('height', 50);

            svgContainer.append('text')
                .attr('fill', 'black')
                .attr('font-size', 15)
                .attr('x', 0)
                .attr('y', 25)
                .text(house);

            var alive = svgContainer.append('rect')
                .attr('fill', '#FFC72E')
                .attr('width', aliveInHouse.length / 175 * window.innerWidth)
                .attr('height', 50)
                .attr('x', window.innerWidth / 4)
                .attr('y', 0)
                .on("mouseover", function() {
                    return tooltipAlive.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltipAlive.style("top",
                        (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    return tooltipAlive.style("visibility", "hidden");
                })
                .on('mouseenter', mouseEnterAlive)
                .on('mouseleave', mouseLeaveAlive);
            var dead = svgContainer.append('rect')
                .attr('fill', '#45315E')
                .attr('width', deadInHouse.length / 175 * window.innerWidth)
                .attr('height', 50)
                .attr('x', aliveInHouse.length / 175 * window.innerWidth + window.innerWidth / 4)
                .attr('y', 0)
                .on("mouseover", function() {
                    return tooltipDead.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltipDead.style("top",
                        (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    return tooltipDead.style("visibility", "hidden");
                })
                .on('mouseenter', mouseEnterDead)
                .on('mouseleave', mouseLeaveDead);

            function mouseEnterAlive() {
                alive.attr('fill', '#E6A902');
            }

            function mouseLeaveAlive() {
                alive.attr('fill', '#FFC72E');
            }




            function mouseEnterDead() {
                dead.attr('fill', '#231238');
            }

            function mouseLeaveDead() {
                dead.attr('fill', '#45315E');
            }

        });





    });
});
