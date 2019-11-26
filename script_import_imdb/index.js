const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

const jsonTab = [];

const monthNumber = {
    "janvier": "0",
    "février": "1",
    "mars": "2",
    "avril": "3",
    "mai": "4",
    "juin": "5",
    "juillet": "6",
    "août": "7",
    "septembre": "8",
    "octobre": "9",
    "novembre": "10",
    "décembre": "11"
}

function writeFile() {
    fs.writeFile("output.json", JSON.stringify(jsonTab, null, 4), (err) => {
        console.log("File successfully written!");
    });
}

let offset = 0;

for(let i = 0; i < 1; i++){
    offset += i*250;
    url_page = 'https://pro.imdb.com/inproduction/development/_paginated?offset='+offset+'&count=250&q=&ref=undefined&keyspace=TITLE&type=movie&status=RELEASED&year=2019-2019%2C2018-2018%2C2017-2017&sort=ranking&pos=11800&page=4&fbclid=IwAR2P2Bj4ARtl-oOmLLuUkZXy8Rdg_OVxxCN28BQ7ek8ML-lDKrbFS_X8TWo';
    const option = {
        url:url_page,
        headers:{
            Cookie:"uu=BCYpxJsOZr4coDI4Vt0WMBCQM04vcFfBZalTwwuZxNeHeOqZmGGjxKu4j8Rto09EWSzRzTzi4Fab%0D%0ABJrEo6wUgGkFQF-iGgYQ2HJXJ8Ot8h1EahzOXGW67zlvvN2UgAgDXqBoaGKJRshfgkjAsjf33kz8%0D%0AXH3Jj3FvZR5ztTZg6yF6NCI%0D%0A; session-id=132-5492311-6602932; session-id-time=2205409776; _msuuid_518k2z41603=4D2CBB9E-D54B-4C3A-B520-B942DF01DAA6; _fbp=fb.1.1574693381932.345989651; ubid-main=134-2251439-5877542; session-token=\"DPDhr9ats5dlnSEzhtyOXd7BGzV+f3x6lvZlLZjCoHehq4jbA/xdHXUTiKNayOGQfR9XIyXQeeq4N+qqtZP7+2z52qCE5+Vp+49pERlhzjfch2C4+W+dmnVR2UlC7xWUWnlGMGer8yjOB4ISJkv3LQrI8fX+PrxJeIWClOgyE+o0vC5BuAdGltGR+IyssxoVR+V9O0zngfrSt+QzI8yxy4wUAkTRn2I81FQ67A2QEZQ=\"; x-main=\"oFXN@la9gPOVe5x3U7mYqPOVkYSZiMSy6ptm0AmK0t0M6bopq?iqPyEMH1T3pcwB\"; at-main=Atza|IwEBIGEqldipa89IGTzTXfKoV-dpM2Jwn8jSa7aaP0lf4ZQee-hgJbkLTyX4HWgLczFyB_M4p8GlnFCOzRVgLFXNybX7kevLAEzPpzMMa9nh1m9NXjrb8Qy-DP3-GHlBx6rcdxJS_h_xmDDArEUil2jh5ZytNIw1hwpFcmDQcU2r3_rQ700lRsgjPuWg-JW_XjCYZw_IEMxC26zKvMMAagSAM5f7B7kU-k76CuRjBFF-Ts5rZmnYqTRcc3jWn4RIAGfzxo10p04Jhr7OQVN1K96jq56F9BkJEHvGwtxV6Tm7WcvdBUES5R9ghNPuUYZ42zSE3P3m1Gk9uzfbCO5n4E1MfCGITdx7zLx08Ww70iXgHSwsAJOWV2__ZE9KHyPqFcqrGFWUVjzD81ZmtQRJi9cMIS43; sess-at-main=\"bgHSg4J/yaWaCAKz4E03tru4qUHGtRKqkfqs3eieHoQ=\"; id=BCYl3Zud_wsQwFj-H0mdD8NU95O3stLSMbxMTemyluVH-ARcVmXx3_SyMKPl9k2fgU6eb77nXW2c%0D%0AngNGODXyYmPDoIa6XXC3rdrO3wq8pMf5o94JhRWQgxJBGkrr9cA-XB89k7RA1_N9PUlm45l73sMC%0D%0A1g%0D%0A; sid=BCYuGg75AAb7Zx1k7zddRc_5wKUtc-pu45Pm8GCTyC9Z-Vtele9ZT6fYDUmBFz0KTe0-KpB85syV%0D%0Aw3VFWnpZ-Dt0-4ZCMGcLNd3SSkrSniJXrmSxKU9fIDsiBqwAHem2BZVf53kvF6L7iRzQMSr_rKen%0D%0AKQ%0D%0A; pa=BCYl1QDx3iGPAzU6NpxqTlHFiaNmS65BanNNtDvwIzvjGTLvNwO8h5wTpqDJL3cck6ZVmFucslco%0D%0AEgbcDxG-tSPMFyg9G8m24GslH3j3iLKoOH556V-q-r-TXx0I5sOgoDYp%0D%0A; csm-hit=tb:47MAMAM19BRRA92YAZAY+s-47MAMAM19BRRA92YAZAY|1574695620523&t:1574695620524&adb:adblk_no"
        }
    }
    request(option, (error, response, html) =>{
        const $ = cheerio.load(html);
        let country;
        let date;
        let boxOfficeTotal;
        let budget;
        let rating;
        let boxOffices;
        $("#results > li").each(function(i, elem){
            const $elem = $(elem)

            //Title and Tid
            const uri = $elem.find(".display-title .ttip").attr("href")
            let title = $elem.find(".display-title .ttip").text();
            const regex = /\/title\/(tt[0-9]*)\//
            let test = regex.exec(uri)
            let tid = test[1];
            
            //Directors
            const regex_dir = /(\w+\s\w+)\S/mg
            let tmp_director = $elem.find(".display-name").text();
            let director = new Array();
            let dir;
            while((dir = regex_dir.exec(tmp_director)) != null){
                director.push(dir[0]);
            }
            console.log(director);
            
            //Productors
            const regex_prod = /(?=^)((([^\\\[\]\n(\s)])+)(\s|\-|$)?)+((\(\w+\))|)(?!\w*\])/mg
            let tmp_productor = $elem.find(".display-company").text();
            let productor = new Array();
            let prod;
            while((prod = regex_prod.exec(tmp_productor)) != null){
                productor.push(prod[0].split("\n")[0]);
            }

            //Countries
            const regex_coun = /(\w+\s*\w+)+(?=(\s+(\||\,))|$)/mg
            let country = new Array();
            let coun;
            if($("ul li:nth-last-child(1)", elem).text() != $("ul li:nth-child(5)", elem).text()){
                let tmp_country = $("ul li:nth-child(5)", elem).text();
                while((coun = regex_coun.exec(tmp_country)) != null){
                    if(!country.includes(coun[0]) && !coun[0].includes("More") && !coun[0].includes("Less")){
                        country.push(coun[0]);
                    }
                }

            }else{
                 let tmp_country = $("ul li:nth-child(4)", elem).text();
                 while((coun = regex_coun.exec(tmp_country)) != null){
                    if(!country.includes(coun[0])){
                        country.push(coun[0]);
                    }
                }
            
            }




        });
    });

}



/*to calculate the number of pages */
/*request(url, (error, response, html) => {
    const $ = cheerio.load(html);
    let number;
    let description;
    let date;
    let title;
    let link;
    number = 21
    let count = 1;
    for (let i = 1; i <= number; i++) {
        const urlPerPage = 'https://www.lemonde.fr/recherche/?search_keywords=patrick%20balkany&start_at=19/12/1944&end_at=03/11/2019&search_sort=date_desc&page=' + i;

        request(urlPerPage, (err, response2, html2) => {
            if (!err) {
                const $ = cheerio.load(html2);
                $(".js-river-search .teaser").each(function(i, elem){
                    const json = {
                        date: "",
                        title: "",
                        description: "",
                        url: ""
                    };
                    const data = $(elem);
                    let title = $(elem).find(".teaser__title").text();
                    let desc = $(elem).find(".teaser__desc").text();
                    let url = $(elem).find(".teaser__link").attr("href");

                    let regex = /Publié le ([0-9]{1,2}) (\S*) ([0-9]*) à ([0-9]{2})h([0-9]{2})/g;
                    let date = regex.exec($(elem).find(".meta__date").text());
                    //console.log(date)
                    if(date!=null){
                        let dateobj = new Date(Date.UTC(date[3], monthNumber[date[2]], date[1], date[4], date[5], 0));
                        dateobj.setHours(dateobj.getHours() - 1);
                        let d_time = dateobj.getTime();

                        json.date = d_time;
                        json.title = title;
                        json.description = desc;
                        json.url = url;
                        jsonTab.push(json);
                    }
                    
                });
            } else if (err) {
                console.log(err);
            }

            count += 1;

            if (count === number) {
                writeFile();
            }
        });
    }
});*/
