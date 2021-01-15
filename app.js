// Create a function to pull in the json data
// Using 'd3.json' gather the metadata for each sample
d3.json('data.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);

    var select=d3.selectAll('#selDataset');;

    //clear the dataset
    sample_metadata.html("");

    Object.entries(id).forEach(([i,v])=>{
    select.append('option').text(v);
      
    })
})

// Create horizontal bar chart with a dropdown menu
function makePlot(testId){
    d3.json('data.json').then((data)=>{
        // This is the array
        var samples=data.samples;
        var testNum=samples.map(row=>row.id).indexOf(testId);
        // Make bar plot
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