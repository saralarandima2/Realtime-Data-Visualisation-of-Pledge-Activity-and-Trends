import { useEffect, useState, useRef } from 'react';
import { HorizontalGridLines, RadialChart, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis, LabelSeries, HorizontalBarSeries } from 'react-vis';
import './App.css';
import { readPledgeTitleList, readPledgeTypeList, readPostCodesList, readPledgeIDsList, readToalNumberOfPledges, readTotalRaised, readCommentList, readPledgeTitlesAndAmounts, readProjectTitlesAndTotalRaisedAmounts, readProjectDetailsCompletePrecentage, readPledgeProjectSummery, readProjectImage, readPledgeSupporterAreasMapData, readProjectsSupportedMapData } from './fileReaderUtility'
import { getUniqueRandomColor } from './utility';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const UK_MAP_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json";


function PledgeSupporterAreasMap(props) {


  const viewport_100 = document.documentElement.clientHeight * 0.65;

  return (<div className="card mt-2" style={{ height: '56vh' }} >
    <div className="card-header">
      <h5 className="card-title mb-0 text-light">Pledge Supporter Areas</h5>
    </div>
    <div className="card-body d-flex justify-content-center"><ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: [-3, 55.8],
        scale: 2300
      }}
      style={{ height: viewport_100 * 0.7, overflow: 'hidden' }}
    >
      <Geographies geography={UK_MAP_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#566D7E"
              stroke="none"
            />
          ))
        }
      </Geographies>
      {props.pledgeSupporterAreasMapData.map(({ name, coordinates }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={viewport_100 * 0.01} fill="#000080" stroke="none" strokeWidth={0} />
        </Marker>
      ))}
    </ComposableMap>
    </div>
  </div>)
}

function ProjectsSupportedMap(props) {
  const viewport_100 = document.documentElement.clientHeight * 0.65;
  return (

    <div className="card" style={{ height: '100%' }} >
      <div className="card-header">
        <h5 className="card-title mb-0 text-light">Project Location Map</h5>
      </div>
      <div className="card-body d-flex justify-content-center" style={{ overflowY: 'auto' }} >


        <ComposableMap
          projection="geoMercator"

          projectionConfig={{
            center: [-3, 55.8],
            scale: 2300
          }}
          style={{ height: viewport_100 * 0.7 }}
        >
          <Geographies geography={UK_MAP_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#4C787E"
                  stroke="none"
                />
              ))
            }
          </Geographies>
          {props.projectsSupportedMapData.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={viewport_100 * 0.01} fill="#000080" stroke="none" strokeWidth={0} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>

  )
}

function ColorBallWithLabel(props) {
  return (<div className='d-flex p-1 gap-1 align-items-center justify-content-start'>
    <div style={{ backgroundColor: props.color, padding: '5px', borderRadius: '5px' }} >
      <span style={{ textShadow: '1px 1px 0px white, -1px -1px 0px white, -1px 1px 0px white, 1px -1px 0px white' }}>{props.colorLabel}</span>
    </div>
    <span>{props.label}</span>
  </div >)
}

function FiltersUI(props) {



  const handleFilterChange = (event) => {
    props.setCurrentFilter(event.target.value);
  }

  const handleFilterTextChange = (event) => {
    props.setCurrentFilterText(event.target.value);
  }

  let currentFilterUI;
  switch (props.currentFilter) {
    case 'PledgeTitle': {
      currentFilterUI = (<div className="input-group mt-2">
        <label className="input-group-text" >Pledge Title</label>
        <select className="form-select" onChange={handleFilterTextChange} >
          {props.pledgeTitleList.map(title => <option key={title} value={title} >{title}</option>)}
        </select>
      </div>);
      break;
    }
    case 'PledgeType': {
      currentFilterUI = (<div className="input-group mt-2">
        <label className="input-group-text" >Pledge Type</label>
        <select className="form-select" onChange={handleFilterTextChange} >
          {props.pledgeTypeList.map(type => <option key={type} value={type} >{type}</option>)}
        </select>
      </div>);
      break;
    }
    case 'Area': {
      currentFilterUI = (<div className="input-group mt-2">
        <label className="input-group-text" >Area</label>
        <select className="form-select" onChange={handleFilterTextChange} >
          {props.postCodesList.map(postCode => <option key={postCode} value={postCode} >{postCode}</option>)}
        </select>
      </div>);
      break;
    }
    case 'PledgeID': {
      currentFilterUI = (<div className="input-group mt-2">
        <label className="input-group-text" >Pledge ID</label>
        <select className="form-select" onChange={handleFilterTextChange} >
          {props.pledgeIDsList.map(pledgeID => <option key={pledgeID} value={pledgeID} >{pledgeID}</option>)}
        </select>
      </div>)
      break;
    }
    case 'Search': {
      currentFilterUI = (<div className="input-group mt-2">
        <label className="input-group-text" >Search</label>


        <input type="search" className='form-control' placeholder='Search' onChange={handleFilterTextChange} />

      </div>);
      break;
    }
    default:
      currentFilterUI = null;
  }







  return (
    <div className="card" >
      <div className="card-header">
        <h5 className="card-title mb-0 text-light">Search or Filter Pledges & Contribution</h5>
      </div>
      <div className="card-body text-center">

        <div className="text-start">

          <div className='row'>
            <div className='col-6'>
              <div className="form-check form-switch">
                <input className="form-check-input" type="radio" name='FiltersUIFilter' role="switch" id="FiltersUIFilterSearch" value='Search'
                  checked={props.currentFilter === 'Search'}
                  onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="FiltersUIFilterSearch">Search</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="radio" name='FiltersUIFilter' role="switch" id="FiltersUIFilterPledgeTitle" value='PledgeTitle'
                  checked={props.currentFilter === 'PledgeTitle'}
                  onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="FiltersUIFilterPledgeTitle">Pledge Title</label>
              </div>

              <div className="form-check form-switch">
                <input className="form-check-input" type="radio" name='FiltersUIFilter' role="switch" id="FiltersUIFilterPledgeType" value='PledgeType'
                  checked={props.currentFilter === 'PledgeType'}
                  onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="FiltersUIFilterPledgeType">Pledge Type</label>
              </div>
            </div>
            <div className='col-6'>

              <div className="form-check form-switch">
                <input className="form-check-input" type="radio" name='FiltersUIFilter' role="switch" id="FiltersUIFilterArea" value='Area'
                  checked={props.currentFilter === 'Area'}
                  onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="FiltersUIFilterArea">Area</label>
              </div>

              <div className="form-check form-switch">
                <input className="form-check-input" type="radio" name='FiltersUIFilter' role="switch" id="FiltersUIFilterPledgeID" value='PledgeID'
                  checked={props.currentFilter === 'PledgeID'}
                  onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="FiltersUIFilterPledgeID">Pledge ID</label>
              </div>
            </div>
          </div>


        </div>

        {currentFilterUI}



      </div>
    </div>
  )
}

function CommentsCard(props) {
  const commentList = props.commentList;
  if (!commentList) return null;

  const body = commentList.map(data => {
    return (<div className='card text-start mb-2' key={data.Comment}>
      <div className="card-header">
        <h5 className="card-title mb-0 text-light">{data.title}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">{data.Comment}</p>
      </div>
      <div className="card-footer text-muted">
        <div className='d-flex justify-content-between'>
          <span>{data.email}</span>
          <strong>{data.name}</strong>
        </div>
        {data.Date}
      </div>
    </div>);
  });
  return (
    <div className="card mt-2" style={{ height: '75.5vh' }} >
      <div className="card-header">
        <h5 className="card-title mb-0 text-light">Comments</h5>
      </div>
      <div className="card-body text-center" style={{ overflowY: 'auto' }}>
        {body}
      </div>
    </div>
  )
}

function PledgeComparisonCard(props) {
  const colors = [];
  const chartData = [];
  const legendData = [];
  const total = Object.values(props.pledgeComparisonData).reduce((p, c) => p + c, 0);
  Object.keys(props.pledgeComparisonData).forEach(key => {
    const color = getUniqueRandomColor(colors);
    colors.push(color);
    let presentage = Math.round(props.pledgeComparisonData[key] * 100 * 100 / total) / 100 + "%";
    legendData.push((<ColorBallWithLabel
      color={color}
      colorLabel={presentage}
      label={key}
      key={key}
    />));
    chartData.push({
      label: presentage,
      angle: props.pledgeComparisonData[key],
      color: color
    });
  });


  return (<div className="card" style={{ maxHeight: '40vh' }}  >
    <div className="card-header">
      <h5 className="card-title mb-0 text-light">Pledge Comparison</h5>
    </div>
    <div className="card-body text-center " style={{ overflowY: 'auto' }}>
      <div className='d-flex justify-content-center'>

        <RadialChart
          data={chartData}
          width={300}
          height={300}
          showLabels={true}
          labelsStyle={{ textShadow: '1px 1px 0px white, -1px -1px 0px white, -1px 1px 0px white, 1px -1px 0px white' }}
          labelsRadiusMultiplier={0.8}
          colorType="literal"
        />
      </div>
      {legendData}
    </div>
  </div>
  )
}

function TotalRaisedAmountCard(props) {
  const colors = [];
  // const chartData = [];
  const legendData = [];
  // const total = Object.values(props.totalRaisedAmountData).reduce((p, c) => p + c, 0);

  const barChartData = [];
  const labelData = [];

  Object.keys(props.totalRaisedAmountData).forEach((key, index) => {
    const color = getUniqueRandomColor(colors);
    colors.push(color);

    // let presentage = Math.round(props.totalRaisedAmountData[key] * 100 * 100 / total) / 100 + "%";

    legendData.push((<ColorBallWithLabel
      color={color}
      // colorLabel={presentage}
      colorLabel={props.totalRaisedAmountData[key]}
      label={key}
      key={key}
    />));
    // chartData.push({
    //   label: presentage,
    //   angle: props.totalRaisedAmountData[key],
    //   color: color
    // });


    // const keyInitials = key.split(' ').map(k=>k.charAt(0)).join('');
    // console.log(props.totalRaisedAmountData[key])

    barChartData.push({ y: props.totalRaisedAmountData[key], x: key, color: color })
    labelData.push({ y: props.totalRaisedAmountData[key], x: key })
  });


  return (<div className="card" style={{ maxHeight: '40vh' }}  >
    <div className="card-header">
      <h5 className="card-title mb-0 text-light">Comparison of Total Raised Amount</h5>
    </div>
    <div className="card-body" style={{ overflowY: 'auto' }}>
      <div className='d-flex justify-content-center'>

        {/* <RadialChart
          data={chartData}
          width={300}
          height={300}
          showLabels={true}
          labelsStyle={{ textShadow: '1px 1px 0px white, -1px -1px 0px white, -1px 1px 0px white, 1px -1px 0px white' }}
          labelsRadiusMultiplier={0.8}
          colorType="literal"
        /> */}


        <XYPlot xType="ordinal" width={400} height={300} xDistance={100}>
          <VerticalGridLines />
          <HorizontalGridLines />
          {/* <XAxis style={{writingMode: 'vertical-lr',fontSize:'0.8rem'}} /> */}
          <YAxis style={{ fontSize: '0.6rem' }} />
          <VerticalBarSeries data={barChartData} colorType="literal" />
          <LabelSeries data={labelData} getLabel={d => d.y} style={{ fontSize: '0.8rem' }} />
        </XYPlot>
      </div>
      {legendData}
    </div>
  </div>
  )
}



function ProjectImplementationProgressCard(props) {

  if (!props.projectDetailsCompletePrecentageData.total) return null;


  const viewport_100 = document.documentElement.clientHeight * 0.65;
  return (<div className="card" style={{ maxHeight: '20vh' }}  >
    <div className="card-header">
      <h5 className="card-title mb-0 text-light">Project Implementation Progress</h5>
    </div>
    <div className="card-body text-center" style={{ overflowY: 'hidden' }}>

      <div className='d-flex flex-column align-items-center justify-content-center'>



        <RadialChart
          data={[
            {
              label: props.projectDetailsCompletePrecentageData.complete + ' Fullfilled',
              angle: props.projectDetailsCompletePrecentageData.complete
            },
            {
              label: props.projectDetailsCompletePrecentageData.incomplete + ' In Progress',
              angle: props.projectDetailsCompletePrecentageData.incomplete
            }
          ]}
          width={300}
          height={viewport_100 * 0.2}
          showLabels={true}
          labelsStyle={{ textShadow: '1px 1px 0px white, -1px -1px 0px white, -1px 1px 0px white, 1px -1px 0px white' }}
          labelsRadiusMultiplier={0.8}
          innerRadius={viewport_100 * 0.06}
          radius={viewport_100 * 0.09}
        />
      </div>
    </div>
  </div>)
}


function MainUI(props) {
  return (<div className='container-fluid'>
    <div className='row m-1'>
      <div className='col-sm-12 col-md-3 p-1'>

        <FiltersUI
          pledgeTitleList={props.pledgeTitleList}
          pledgeTypeList={props.pledgeTypeList}
          postCodesList={props.postCodesList}
          pledgeIDsList={props.pledgeIDsList}
          currentFilterText={props.currentFilterText}
          setCurrentFilterText={props.setCurrentFilterText}
          currentFilter={props.currentFilter}
          setCurrentFilter={props.setCurrentFilter}
        />

        <CommentsCard commentList={props.commentList} />


      </div>
      <div className='col-sm-12 col-md-6 p-1'>

        <div className='row' style={{ height: '57vh' }}>
          <div className='col-sm-12 col-md-6 pe-1'>
            <div className='d-flex gap-1 ' style={{ maxHeight: '20vh' }} >

              <div className="card  flex-fill" >
                <div className="card-header">
                  <h5 className="card-title mb-0 text-light">Total Number of Pledges</h5>
                </div>
                <div className="card-body text-center">
                  <h1 className="display-1" style={{ fontSize: '3rem' }}>{props.toalNumberOfPledges}</h1>
                </div>
              </div>

              <div className="card  flex-fill" >
                <div className="card-header">
                  <h5 className="card-title mb-0 text-light">Total Raised</h5>
                </div>
                <div className="card-body text-center">
                  <h1 className="display-1" style={{ fontSize: '3rem' }}>{props.totalRaised}</h1>
                </div>
              </div>

            </div>


            <div className="card mt-2" style={{ height: '41vh' }} >
              <div className="card-header">
                <h5 className="card-title mb-0 text-light">Pledge / Project Summary</h5>
              </div>
              <div className="card-body" style={{ overflowY: 'auto' }}>
                <table className="table table-borderless table-striped">
                  <tbody>
                    {props.pledgeProjectSummery.map(data => {
                      return (<tr key={JSON.stringify(data)}>
                        <td>{data.title}</td>
                        <td>{data.start}</td>
                        <td>-</td>
                        <td>{data.end}</td>
                      </tr>)
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='col-sm-12 col-md-6 ps-1'>

            <ProjectsSupportedMap projectsSupportedMapData={props.projectsSupportedMapData} />



          </div>
        </div>



        <div className="row mt-2">
          <div className='col-sm-12 col-md-6 pe-1'>
            <PledgeComparisonCard pledgeComparisonData={props.pledgeComparisonData} />
          </div>
          <div className='col-sm-12 col-md-6 ps-1'>
            <TotalRaisedAmountCard totalRaisedAmountData={props.totalRaisedAmountData} />
          </div>
        </div>


      </div>
      <div className='col-sm-12 col-md-3 p-1'>
        {(props.projectImage) ? (<div className="card mb-2" style={{ maxHeight: '20vh', overflow: 'hidden' }}  >
          <img src={props.projectImage} class="card-img-top" />
        </div>
        ) : null}

        <ProjectImplementationProgressCard projectDetailsCompletePrecentageData={props.projectDetailsCompletePrecentageData} />

        <PledgeSupporterAreasMap pledgeSupporterAreasMapData={props.pledgeSupporterAreasMapData} />


      </div>
    </div>
  </div>)
}

function App() {

  const firstLoad = useRef(true);
  const [toalNumberOfPledges, setToalNumberOfPledges] = useState(0);
  const [totalRaised, setTotalRaised] = useState(0);

  const [pledgeTitleList, setPledgeTitleList] = useState([]);
  const [pledgeTypeList, setPledgeTypeList] = useState([]);
  const [postCodesList, setPostCodesList] = useState([]);
  const [pledgeIDsList, setPledgeIDsList] = useState([]);

  const [pledgeComparisonData, setPledgeComparisonData] = useState([])
  const [totalRaisedAmountData, setTotalRaisedAmountData] = useState([])
  const [projectDetailsCompletePrecentageData, setProjectDetailsCompletePrecentageData] = useState({})
  const [pledgeProjectSummery, setPledgeProjectSummery] = useState([])

  const [pledgeSupporterAreasMapData, setPledgeSupporterAreasMapData] = useState([]);
  const [projectsSupportedMapData, setProjectsSupportedMapData] = useState([]);

  const [projectImage, setProjectImage] = useState('https://www.crowdfunder.co.uk/uploads/site/pages/1/assets/crowdfunder-2018-og.jpg');

  const [currentFilter, setCurrentFilter] = useState('Search');
  const [currentFilterText, setCurrentFilterText] = useState(null);

  const [commentList, setCommentList] = useState([]);

  const updateCurrentFilter = filter => {
    setCurrentFilter(filter);
    setCurrentFilterText(filter === 'Search' ? '' : 'All');
  }

  useEffect(() => {
    if (firstLoad.current) {
      readToalNumberOfPledges(setToalNumberOfPledges);
      readTotalRaised(setTotalRaised);
      readPledgeTitleList(setPledgeTitleList);
      readPledgeTypeList(setPledgeTypeList);
      readPostCodesList(setPostCodesList);
      readPledgeIDsList(setPledgeIDsList);
      readCommentList(setCommentList);
      readPledgeTitlesAndAmounts(setPledgeComparisonData);
      readProjectTitlesAndTotalRaisedAmounts(setTotalRaisedAmountData);
      readProjectDetailsCompletePrecentage(setProjectDetailsCompletePrecentageData);
      readPledgeProjectSummery(setPledgeProjectSummery);
      readPledgeSupporterAreasMapData(setPledgeSupporterAreasMapData);
      readProjectsSupportedMapData(setProjectsSupportedMapData);
      firstLoad.current = false;
    }
  })

  useEffect(() => {
    readToalNumberOfPledges(setToalNumberOfPledges, { filterType: currentFilter, filterText: currentFilterText });
    readPledgeSupporterAreasMapData(setPledgeSupporterAreasMapData, { filterType: currentFilter, filterText: currentFilterText });
    if (currentFilter === 'PledgeTitle') {
      readTotalRaised(setTotalRaised, { filterType: currentFilter, filterText: currentFilterText });
      readCommentList(setCommentList, { filterType: currentFilter, filterText: currentFilterText });
      readProjectDetailsCompletePrecentage(setProjectDetailsCompletePrecentageData, { filterType: currentFilter, filterText: currentFilterText });
      readPledgeProjectSummery(setPledgeProjectSummery, { filterType: currentFilter, filterText: currentFilterText });
      readProjectsSupportedMapData(setProjectsSupportedMapData, { filterType: currentFilter, filterText: currentFilterText });
      if (currentFilterText === 'All') {
        setProjectImage('https://www.crowdfunder.co.uk/uploads/site/pages/1/assets/crowdfunder-2018-og.jpg');
      } else {
        readProjectImage(currentFilterText, setProjectImage);
      }
    } else if (currentFilter === 'Search') {
      readTotalRaised(setTotalRaised, { filterType: currentFilter, filterText: currentFilterText });
      readCommentList(setCommentList, { filterType: currentFilter, filterText: currentFilterText });
      readProjectDetailsCompletePrecentage(setProjectDetailsCompletePrecentageData, { filterType: currentFilter, filterText: currentFilterText });
      readPledgeProjectSummery(setPledgeProjectSummery, { filterType: currentFilter, filterText: currentFilterText });
      readProjectsSupportedMapData(setProjectsSupportedMapData, { filterType: currentFilter, filterText: currentFilterText });
      readProjectImage(currentFilterText, setProjectImage);
    } else {
      readTotalRaised(setTotalRaised);
      readCommentList(setCommentList);
      readProjectDetailsCompletePrecentage(setProjectDetailsCompletePrecentageData);
      readPledgeProjectSummery(setPledgeProjectSummery);
      readProjectsSupportedMapData(setProjectsSupportedMapData);
      setProjectImage('https://www.crowdfunder.co.uk/uploads/site/pages/1/assets/crowdfunder-2018-og.jpg');
    }

  }, [currentFilter, currentFilterText])

  return (
    <MainUI
      toalNumberOfPledges={toalNumberOfPledges}
      totalRaised={totalRaised}
      pledgeTitleList={pledgeTitleList}
      pledgeTypeList={pledgeTypeList}
      postCodesList={postCodesList}
      pledgeIDsList={pledgeIDsList}
      setCurrentFilter={updateCurrentFilter}
      setCurrentFilterText={setCurrentFilterText}
      currentFilter={currentFilter}
      currentFilterText={currentFilterText}
      commentList={commentList}
      pledgeComparisonData={pledgeComparisonData}
      totalRaisedAmountData={totalRaisedAmountData}
      projectDetailsCompletePrecentageData={projectDetailsCompletePrecentageData}
      pledgeProjectSummery={pledgeProjectSummery}
      projectImage={projectImage}
      pledgeSupporterAreasMapData={pledgeSupporterAreasMapData}
      projectsSupportedMapData={projectsSupportedMapData}
    />
  );

}

export default App;
