// Create a function to pull in the json data
// Using 'd3.json' gather the metadata for each sample
d3.json('samples.json').then((samples)=>{
    var id=samples.names;
    console.log(samples.metadata);

    var select=d3.selectAll('#selDataset');;
      
    //clear the dataset
    //sample_metadata.html("");

    id.forEach((v)=>{
    select.append('option').text(v).property("value",v);
      
    })
    firstid=id[0]
    makePlot(firstid)
    updateMeta(firstid)
})
// Update metadata
function updateMeta(id){
    // read in the data file 
    d3.json('samples.json').then((samples)=>{
        var meta=samples.metadata;
        // Take the id and filter the variable meta
        var results = meta.filter(newData => newData.id == id)[0]
        // With the filtered results post them in the #sample-metadata div
        var metadata=d3.selectAll('#sample-metadata');;    
        metadata.html("");
        // Show all the meta data
        Object.entries(results).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        })
    })
}

// Define the source of the data and make the charts
function makePlot(testId){
    d3.json('samples.json').then((samples)=>{
        // create an array
        var samples=samples.samples;
        var testNum=samples.map(row=>row.id).indexOf(testId);

        // Define the bar chart
        var otuValueTen=samples.map(row=>row.sample_values);
        var otuValueTen=otuValueTen[testNum].slice(0,10).reverse();
        var otuIdTen=samples.map(row=>row.otu_ids);
        var otuIdTen=otuIdTen[testNum].slice(0,10);
        var otuLabelTen=samples.map(row=>row.otu_labels); 
        var otuLabelTen=otuLabelTen[testNum].slice(0,10); 
        var trace={
            x: otuValueTen,
            y: otuIdTen.map(r=>`UTO ${r}`),
            text: otuLabelTen,
            type:'bar',
            orientation:'h'
        }
        Plotly.newPlot('bar',[trace]);

        // Define the bubble chart
        var otuValue=samples.map(row=>row.sample_values);
        var otuValue=otuValue[testNum];
        var otuId=samples.map(row=>row.otu_ids);
        var otuId=otuId[testNum];
        var otuLabel=samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[testNum];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var data1=[trace1];
        var bubbleLayout={
            xaxis:{
                autochange: true,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble',data1,bubbleLayout); 
    })
}

// Review new ID
function optionChanged(newId) {
    // Select a new ID from the drop down menu
    makePlot(newId);
    // Updates the metadata
    updateMeta(newId);
}