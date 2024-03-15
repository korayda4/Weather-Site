import { useState, useEffect } from 'react';
import locationImage from "../src/assets/icons8-location-100.png";
import windImage from "../src/assets/icons8-wind-100.png"
import humidityImage from "../src/assets/icons8-wet-100.png"
import searchImage from "../src/assets/icons8-search-100.png"
import uvImage from "../src/assets/icons8-uv-index-100.png"
import { App} from 'antd';
import { Input} from 'antd';
import './App.css';

function MainPage() {
  const { Search } = Input;
  const [ country , setCountry] = useState("Istanbul")
  const [currentTime , setCurrentTime] = useState("")
  const [currentImg, setCurrentImg] = useState("");
  const API_KEY = "e30bf81ae98c4350aa8110842241503";
  const ForecastLink = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${country}&days=6`;
  const [searchVisibility , setSearchVisibility] = useState(false)
  const { message, notification } = App.useApp();
  const [data, setData] = useState(null);
  const [inputValue , setInputValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ForecastLink);
        const json = await response.json();
        console.log(json);
        setCurrentImg(json.current.condition.icon);
        setCurrentTime(json.location.localtime.slice(11,16))
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    
    fetchData();
  }, [country]);

  const onSearch = () => {
    setSearchVisibility(!searchVisibility)
    searchVisibility ? setCountry(inputValue):null
    showNotification
  }

  const showNotification = () => {
    notification.info({
      message: `success`,
      description: `${country}, verileri getirildi!`,
    });
  };

  const onInput = (x) => {
    setInputValue(x.target.value)
  }

  return (
    <div className="container">
      {data ? (
        <div className="weatherContainer">
          <div className="locationContainer">
            <div className="name">
              <img src={locationImage} alt="" />
              <h2>{data.location.name}</h2> 
            </div>
            <div className="searcherDiv">
              <input
                onChange={(x) => onInput(x)}
                className='inputSearch'
                style={{ width: searchVisibility ? "" : "0px"}}
                type="text"
              />
              <img className='searchBtn' onClick={onSearch} src={searchImage} alt="" />
            </div>
          </div>
          <div className="degreeContainer">
            <div className="infoAll">
              <div className="currentTime">
                <h2>{currentTime}</h2>
              </div>
              <div className="wind">
                <img src={windImage} alt="" />
                <h2>{data.current.wind_mph} <br/><p style={{fontSize:"6px"}}>KM/H</p></h2>
              </div>
              <div className="humidity">
                <img src={humidityImage} alt="" />
                <h2>%{data.current.humidity}<br/><p style={{fontSize:"6px"}}>nem</p></h2>
              </div>
              <div className="uv">
                <img src={uvImage} alt="" />
                <h2>% {data.current.uv}</h2>
              </div>
            </div>
            <div className="degree">
              <img src={currentImg} alt="" />
              <div className="text">
                <p>{data.current.temp_c}°</p>

              </div>
              <div className="maxMin">
                <p>Max:10°</p>
                <p>Min:4°</p>
              </div>
            </div>
          </div>
          <div className="weatherDetailContainer">
            {data.forecast.forecastday.map((x, i) => {
                return (
                  i !== 0 ?
                  (<div className="future" key={i}>
                        <h3 className="futureTime">{x.date}</h3>
                        <img src={x.day.condition.icon} alt="" />
                        <h3>{x.day.avgtemp_c}°</h3>
                  </div>):null
                );
              })}


          </div>
        </div>
      ) : (
        <div>Hava Durumu Yükleniyor...</div>
      )}
    </div>
  );
}

export default MainPage;
