var fs = require("fs")

function generateMdFile(rssFile, mdFile) {
    fs.readFile(rssFile, function(err, data) {
        if (err) {
            console.log("Fail to read JSON file.");
            return;
        }
        var jsonContent = JSON.parse(data);
        //console.log(jsonContent);
        var selectEntries = [];
        jsonContent.map(function(element) {
            //console.log(element.title);
            element.entries.map(function(entry) {
                if (entry.title.search("安邦-") >= 0) {
                    selectEntries.push(entry);
                }
            });
        });

        if (selectEntries.length == 0) {
            console.log("No seed about 安邦.");
            return;
        }
        var articles = [];
        selectEntries.map(function(entry) {
            //console.log("   " + entry.title);
            //console.log("   >>" + entry.description);
            var rawDesc = entry.description.replace(/〖.{1,20}〗/g, "").replace(/（[A-Z]{3,4}）\s?返回目录/g, "").trim();
            var news = rawDesc.split("【");
            news.map(function(n) {
                var nn = n.replace(/<p>/g, "").replace(/<\/p>/g, "\n").trim();
                //console.log("====================");
                //console.log(nn);
                if (nn.length > 0) {
                    var article = nn.split("】");
                    articles.push({
                        title: article[0].trim(),
                        content: article[1].trim()
                    });
                }
            })
        });

        var firstArt = true;
        var outputStr = "";
        articles.map(function(art) {
            //console.log("===========\n" + art.title);
            //console.log("-----------\n" + art.content);
            outputStr = outputStr + "### " + art.title + "\n\n" + art.content + "\n\n";
            if (firstArt) {
                outputStr = outputStr + "<!--more-->\n"
                firstArt = false;
            }
        });
        //console.log(outputStr);
        if (outputStr.length > 0) {
            fs.writeFileSync(mdFile, outputStr);
        }
    });
}

//console.log(process.argv);
generateMdFile(process.argv[2] ? process.argv[2] : "rss.json",
    process.argv[3] ? process.argv[3] : "output.md");

