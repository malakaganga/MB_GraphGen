var elapsedTime;
var averageTime;
var elapsedTime1;
var averageTime1;
var file_name;
var el_new;
var av_new;
var el1_new;
var av1_new;

var ar;
var ar1;
var len =0;
var len1 =0;
var count=0;
averageTime=[];
averageTime1=[];
elapsedTime=[];
elapsedTime1=[];


function readSingleFile(evt) {
    av_new=new Array(evt.target.files.length);
    av1_new=new Array(evt.target.files.length);
    el_new=new Array(evt.target.files.length);
    el1_new=new Array(evt.target.files.length);
    file_name=new Array(evt.target.files.length);
    count=0;
    for(var p=0;p<evt.target.files.length;p++){
        file_name[p] =evt.target.files[p].name;
        var f = evt.target.files[p];
        //alert(file_name[p]+evt.target.files.length);

        if (f) {
            var r = new FileReader();

            r.onload = function(e) {
                len=0;
                len1=0;
                var contents = e.target.result;
                var lines = contents.split('\n');//Get line by line to array

                for(var line = 0; line < lines.length; line++){// Go through lines
                    var regex=/^summary =/; //If line is starting from summary = we get it using RegEx
                    var regex1=/^summary +/;

                    if(regex.test(lines[line])){
                        len++;//increment the count
                        var newLine=lines[line].replace(/\s+/g,',');//replace all the white spaces using ,
                        var words=newLine.split(",");  //Then split the words using ,
                        elapsedTime[len-1]=words[2];
                        averageTime[len-1]=words[6].replace(/\/s/g,'');//replace "/s"
                        //      max=Math.max.apply(Math,averageTime);
                    }

                    ////////// second summary report
                    else if(regex1.test(lines[line])){
                        len1++;//increment the count
                        var newLine=lines[line].replace(/\s+/g,',');//replace all the white spaces using ,
                        var words=newLine.split(",");  //Then split the words using ,
                        elapsedTime1[len1-1]=words[2];
                        averageTime1[len1-1]=words[6].replace(/\/s/g,'');//replace "/s"
                    }
                }
                av_new[count]=new Array(averageTime.length);
                for(var j=0;j<averageTime.length;j++)av_new[count][j]=averageTime[j];//add data to M-D array
                av1_new[count]=new Array(averageTime1.length);
                for(var j=0;j<averageTime1.length;j++)av1_new[count][j]=averageTime1[j];
                count++;
                if(count==evt.target.files.length)
                    plotMyGraph();
            };
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }
}
function plotMyGraph(){
    var data=[];
    var fg=0;

    for(var g=0;g<count;g++){
        ar=new Array(av_new[g].length);//get the x-axis components
        for(var i=0;i<av_new[g].length;i++)ar[i]=i;

        var trace2 = {
            x: ar,
            y: av_new[g],
            mode: 'lines+markers',
            name:file_name[g]+' :Cumilative Avg'
        };

        ar1=new Array(av1_new[g].length);//get the x-axis components
        for(var i=0;i<av1_new[g].length;i++)ar1[i]=i;

        var trace3 = {
            x: ar1,
            y: av1_new[g],
            mode: 'lines+markers',
            name: file_name[g]+': Instantaneous Avg'
        };

        data[fg++] = trace2;
        data[fg++] = trace3;

    }
    var layout = {
        title:'MB Performance Tests & Comparison',
        height: 630,
        width: 1260,xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
            title: 'samples'         // more about "layout.xaxis.title": #layout-xaxis-title
        },yaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
            title: 'Avarage'         // more about "layout.xaxis.title": #layout-xaxis-title
        }
    };
    Plotly.newPlot('myDiv', data, layout);   //plot whole graph
}

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
