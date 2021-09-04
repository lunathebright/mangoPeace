import React from 'react';

import StoreHeader from './StoreHeader/StoreHeader';
import StoreInfoTable from './StoreInfoTable/StoreInfoTable';
import StoreLocation from './StoreLocation/StoreLocation';

import './StoreInfo.scss';

class StoreInfo extends React.Component {
  splitCoordinate = coordinate => {
    const result = coordinate.split(',');
    const lat = parseFloat(result[0]);
    const lng = parseFloat(result[1].slice(1));

    return [lat, lng];
  };

  render() {
    const { restaurantsData, foodsData, storeId, handleSetRestaurants } =
      this.props;

    return (
      <div className="storeInfo">
        <StoreHeader
          storeId={storeId}
          restaurantsData={restaurantsData}
          handleSetRestaurants={handleSetRestaurants}
        />
        <div className="storeInfoBottom">
          <StoreInfoTable
            restaurantsData={restaurantsData}
            foodsData={foodsData}
          />
          <StoreLocation
            storeCoordinate={this.splitCoordinate(restaurantsData.coordinate)}
          />
        </div>
      </div>
    );
  }
}

export default StoreInfo;
