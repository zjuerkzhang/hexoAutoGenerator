#!/bin/sh
export LANG="zh_CN.UTF-8"

execPath="/var/www/blog/autogen"
jsonFile="rss.json"
jsonPath="/root/RssToKindle/RssToKindle/src/"$jsonFile
outputMd="output.md"
logfile="log.log"

/bin/date 
PATH=/usr/local/bin:$PATH
cd $execPath

if [ -e $jsonPath ]
    then
    cp $jsonPath ./

    dateStr=`date +%Y%m%d`
    ls ../source/_posts/|grep $dateStr
    if [ $? -eq 0 ]
        then
        rm $jsonFile
        echo "MD file already exists."
        exit 0
    fi
    mdFile="经济信息"$dateStr
    /usr/local/bin/hexo new $mdFile
    #targetFile=`ls ../source/_posts/|grep $dateStr`
    if [ $? -eq 0 ]
        then
        targetFile=$mdFile".md"
        mv ../source/_posts/$targetFile ./
        sed -i '4a  - 经济\n- 摘选' $targetFile

        /usr/local/bin/node autogen.js $jsonFile $outputMd
        if [ -e $outputMd ]
            then
            cat $outputMd >> $targetFile
            rm $outputMd
            mv $targetFile ../source/_posts/
        else
            echo "No MD file generated from RSS file"
            rm $targetFile
        fi
        /usr/local/bin/hexo clean
        /usr/local/bin/hexo g
    else
        echo "Command <hexo new $dateStr> fail"
    fi
    rm $jsonFile
else
    echo "No $jsonFile exists"
fi
