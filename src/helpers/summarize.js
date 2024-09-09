 
  // Example usage:
  // const summary = summarizeData(jsonData);
  // console.log(summary);


export function summarize(data) {
    let minYear = Infinity;
    let maxYear = 0;
    let totalSum = 0;
  
    // Iterate through the data
    for (const map of Object.values(data)) {
      console.log("Map",map);
      for (const layer of map.layer) {
        console.log("Layer",layer);
        for (const place of Object.values(layer.places)) {
          const startDate = new Date(place.startdate).getTime();
  
          // Update the earliest and latest dates
          minYear = Math.min(minYear, startDate);
          maxYear = Math.max(maxYear, startDate);
  
          // Sum the values
          totalSum += 1;
        }
      }
    }
  
    // Convert the earliest and latest dates back to strings
    const minYearISOString = new Date(minYear).toISOString().slice(0, 4);
    const maxYearISOString = new Date(maxYear).toISOString().slice(0, 4);
  
    return {
      minYear: minYearISOString,
      maxYear: maxYearISOString,
      totalSum
    };
  }
 