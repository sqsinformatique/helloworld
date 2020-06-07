import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { YMaps, Map, Placemark, RoutePanel } from 'react-yandex-maps';

const mapState = {center: [55.751574, 37.573856], zoom: 9, controls: ['zoomControl'] };  

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [userGeodata, setGeodata] = useState({lat: 0, long: 0});

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  async function fetchGeoData() {
    const geodata = await bridge.send('VKWebAppGetGeodata');
    setGeodata(geodata);
  }

  useEffect(() => {
    fetchGeoData();  
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 5);
        fetchGeoData();
      }, 5000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (

    <div className="app">
      <div className="time">
      {seconds}s geodata {userGeodata.lat}; {userGeodata.long}
      <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="button" onClick={reset}>
          Reset
        </button>

      <YMaps query={{ apikey: '482da132-c4be-476f-95ef-79ba61d579a4', load: 'control.ZoomControl' }} >
        <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' > 
        {/* <Placemark geometry={[55.684758, 37.738521]} /> */}
        {/* `${userGeodata.lat} +','+ ${userGeodata.long} */}
        <RoutePanel 
            instanceRef={ref => {
                if (ref) {
                  ref.routePanel.state.set({
                    fromEnabled: false,
                    type: 'masstransit',
                    from: userGeodata.lat+","+userGeodata.long,
                    to: "Москва, метро Братиславская",
                    toEnabled: false,
                  });
                  ref.routePanel.options.set({
                    // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
                    allowSwitch: false,
                    // Включим определение адреса по координатам клика.
                    // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
                    reverseGeocoding: true,
                    // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
                    types: { masstransit: false, pedestrian: false, taxi: false }
                  })
                }
            }}
            options={{ 
                float: 'right',
            }}
         />
        </Map>
      </YMaps>

      </div>
      <div className="row">
      </div>
    </div>
  );
};

export default Timer;