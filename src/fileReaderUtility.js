import Papa from 'papaparse'
import commentDataFile from './csv/DSC_-_comment_data_2022_07_10.csv';
import projectDatailFile from './csv/DSC_-_project_detail_2022_07_10.csv';
import projectsSupportedFile from './csv/DSC_-_projects_supported_2022_07_10.csv';
import supportersFile from './csv/DSC_-_supporters_2022_07_10.csv';
import getLatLng from './postCodeApi';

function readPledgeSupporterAreasMapData(callBack, options) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }
            const index = headers.indexOf('card_postcode')

            getLatLng(data.map(row => row[index]), callBack);
        });
}

function readProjectsSupportedMapData(callBack, options) {
    fetch(projectsSupportedFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }
            const latIndex = headers.indexOf('lat')
            const lngIndex = headers.indexOf('lng')

            callBack(data.map(row => {
                const longitude = row[lngIndex];
                const latitude = row[latIndex];
                const name = longitude + '' + latitude;
                if (name) {
                    return {
                        name,
                        coordinates: [longitude, latitude]
                    }
                }
                return false;
            }).filter(d => d));



        });
}

function readProjectImage(title, callBack) {
    fetch(projectDatailFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            const imageIndex = headers.indexOf('image');
            const titleIndex = headers.indexOf('title');
            const url = data.find(row => row[titleIndex] === title)[imageIndex];
            callBack(url || 'https://www.crowdfunder.co.uk/uploads/site/pages/1/assets/crowdfunder-2018-og.jpg');
        })
}

function readPledgeProjectSummery(callBack, options = null) {
    fetch(projectDatailFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            const titleIndex = headers.indexOf('title');
            const startIndex = headers.indexOf('date(p.date_added)');
            const endIndex = headers.indexOf('date(p.date_closing)');
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }

            data = data
                .map(row => ({ title: row[titleIndex], start: row[startIndex], end: row[endIndex] }))
                .filter((value, index, self) => self.findIndex(d => d.title === value.title) === index);

            callBack(data);
        })
}

function readProjectDetailsCompletePrecentage(callBack, options = null) {
    const today = Date.now();

    fetch(projectDatailFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();


            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }


            const endIndex = headers.indexOf('date(p.date_closing)');
            const result = data.map(project => {
                let end = project[endIndex].split('/');
                end = new Date(end[1] + '-' + end[0] + '-' + end[2]).getTime();
                return end < today;
            }).reduce((prev, curr) => {
                prev.total = prev.total + 1;
                if (curr) {
                    prev.complete = prev.complete + 1;
                } else {
                    prev.incomplete = prev.incomplete + 1;
                }
                return prev;
            }, { total: 0, complete: 0, incomplete: 0 });
            callBack(result);
        })
}

function readPledgeTitlesAndAmounts(callBack) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            const titleIndex = headers.indexOf('title');
            const amountIndex = headers.indexOf('pledge_amount');
            const result = data.reduce((prev, curr) => {
                const title = curr[titleIndex];
                const newObj = { ...prev };
                if (!newObj[title]) {
                    newObj[title] = 0;
                }
                newObj[title] = newObj[title] + (+curr[amountIndex]);
                return newObj;
            }, {});
            callBack(result);
        })
}

function readProjectTitlesAndTotalRaisedAmounts(callBack) {
    fetch(projectsSupportedFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            const titleIndex = headers.indexOf('title');
            const totalRaisedIndex = headers.indexOf('total_raised');
            const result = data.reduce((prev, curr) => {
                const title = curr[titleIndex];
                const newObj = { ...prev };
                if (!newObj[title]) {
                    newObj[title] = 0;
                }
                newObj[title] = newObj[title] + (+curr[totalRaisedIndex]);
                return newObj;
            }, {});
            callBack(result);
        })
}

function readPledgeTitleList(callBack) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const index = data.shift().indexOf('title');
            const result = data.map(row => row[index]).filter((value, index, self) => self.indexOf(value) === index);
            result.unshift('All');
            callBack(result);
        })
}

function readPledgeTypeList(callBack) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const index = data.shift().indexOf('pledge_type');
            const result = data.map(row => row[index]).filter((value, index, self) => self.indexOf(value) === index)
            result.unshift('All');
            callBack(result);
        })
}

function readPostCodesList(callBack) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const index = data.shift().indexOf('card_postcode');
            const result = data.map(row => row[index]).filter(value => value).filter((value, index, self) => self.indexOf(value) === index)
            result.unshift('All');
            callBack(result);
        })
}

function readPledgeIDsList(callBack) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const index = data.shift().indexOf('pledge_id');
            const result = data.map(row => row[index]).filter((value, index, self) => self.indexOf(value) === index)
            result.unshift('All');
            callBack(result);
        })
}

function readToalNumberOfPledges(callBack, options = null) {
    fetch(supportersFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }
            const index = headers.indexOf('pledge_amount')
            callBack(data.reduce((acc, cur) => acc + parseInt(cur[index]), 0));
        });
}

function readTotalRaised(callBack, options = null) {
    fetch(projectsSupportedFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            const index = headers.indexOf('total_raised')
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }
            callBack(data.reduce((acc, cur) => acc + parseInt(cur[index]), 0));
        });
}

function readCommentList(callBack, options = null) {
    fetch(commentDataFile)
        .then((resp) => resp.text())
        .then(data => Papa.parse(data).data.filter(row => row.join('').length !== 0))
        .then(data => {
            const headers = data.shift();
            if (options) {
                if (options.filterText !== 'All') {
                    switch (options.filterType) {
                        case 'PledgeTitle': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeType': {
                            const filterIndex = headers.indexOf('pledge_type');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Area': {
                            const filterIndex = headers.indexOf('card_postcode');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'PledgeID': {
                            const filterIndex = headers.indexOf('pledge_id');
                            data = data.filter(row => row[filterIndex] === options.filterText);
                            break;
                        }
                        case 'Search': {
                            const filterIndex = headers.indexOf('title');
                            data = data.filter(row => row[filterIndex]).filter(row => row[filterIndex].toLowerCase().includes(options.filterText.toLowerCase()));
                            break;
                        }
                    }
                }
            }
            return data.map(d => {
                const obj = {};
                headers.forEach((header, index) => obj[header] = d[index]);
                return obj;
            })
        }).then(callBack)
}

export {
    readPledgeTitlesAndAmounts,
    readProjectTitlesAndTotalRaisedAmounts,
    readProjectDetailsCompletePrecentage,
    readPledgeProjectSummery,
    readProjectImage,
    readPledgeTitleList,
    readPledgeTypeList,
    readPostCodesList,
    readPledgeIDsList,
    readToalNumberOfPledges,
    readTotalRaised,
    readCommentList,
    readPledgeSupporterAreasMapData,
    readProjectsSupportedMapData
}