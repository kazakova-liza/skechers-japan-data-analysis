function groupBy(data, config) {
  if (config.bys === undefined) {
    throw 'config.bys is undefined';
  }
  if (config.sums === undefined) {
    config.sums = [];
  }
  if (config.dcnts === undefined) {
    config.dcnts = [];
  }
  if (config.max === undefined) {
    config.max = [];
  }
  if (config.min === undefined) {
    config.min = [];
  }
  if (config.avg === undefined) {
    config.avg = [];
  }
  if (config.filters === undefined) {
    config.filters = [];
  }
  const res3 = {};
  const dcntArr = {};
  let filteredData = data;
  if (config.filters.length != 0) {
    for (const filter of config.filters) {
      filteredData = filteredData.filter((item) => {
        if (filter.requirement === 'greater than') {
          return item[filter.key] > filter.value;
        }
        if (filter.requirement === 'equals') {
          return item[filter.key] === filter.value;
        }
        if (filter.requirement === 'less than') {
          return item[filter.key] < filter.value;
        }
        if (filter.requirement === 'greater or equals') {
          return item[filter.key] >= filter.value;
        }
        if (filter.requirement === 'less or equals') {
          return item[filter.key] <= filter.value;
        }
      });
    }
  }
  for (const record of data) {
    const thisByRecArr = [];
    let thisByRecName = '';
    for (const by of config.bys) {
      const thisByRec = record[by];
      let thisBy = 'null';
      if (thisByRec != null) {
        thisBy = thisByRec;
      }
      thisByRecArr.push(thisBy);
      thisByRecName += (`${thisBy}-`);
    }
    if (!(thisByRecName in res3)) { // NEW ROW
      const newRec2 = {};
      for (let a = 0; a < config.bys.length; a++) {
        newRec2[config.bys[a]] = thisByRecArr[a];
      }
      newRec2.cnt = 0;
      for (const sum of config.sums) {
        newRec2[`${sum}_sum`] = 0;
      }
      for (const max of config.max) {
        newRec2[`${max}_max`] = record[max];
      }
      for (const avg of config.avg) {
        newRec2[`${avg}_avg`] = [];
      }
      for (const min of config.min) {
        newRec2[`${min}_min`] = record[min];
      }
      dcntArr[thisByRecName] = {};
      for (const dcnt of config.dcnts) {
        newRec2[`${dcnt}_dcnt`] = 0;
        dcntArr[thisByRecName][dcnt] = new Set();
      }
      res3[thisByRecName] = newRec2;
    }

    res3[thisByRecName].cnt += 1;
    for (const sum of config.sums) {
      res3[thisByRecName][`${sum}_sum`] += record[sum];
    }
    for (const max of config.max) {
      if (record[max] > res3[thisByRecName][`${max}_max`]) {
        res3[thisByRecName][`${max}_max`] = record[max];
      }
    }
    for (const avg of config.avg) {
      res3[thisByRecName][`${avg}_avg`].push(record[avg])
    }
    for (const min of config.min) {
      if (record[min] < res3[thisByRecName][`${min}_min`]) {
        res3[thisByRecName][`${min}_min`] = record[min];
      }
    }
    for (const dcnt of config.dcnts) {
      dcntArr[thisByRecName][dcnt].add(record[dcnt]);
      res3[thisByRecName][`${dcnt}_dcnt`] = dcntArr[thisByRecName][dcnt].size;
    }
  }
  const res4 = [];
  for (const [key, value] of Object.entries(res3)) {
    for (const avg of config.avg) {//calc average
      const arr = value[`${avg}_avg`]
      const avgRes = arr.reduce((p, c) => p + c, 0) / arr.length;
      value[`${avg}_avg`] = avgRes
    }
    res4.push(value);
  }
  return res4;
}

export default groupBy;
