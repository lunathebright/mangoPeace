import React from 'react';

import { BASE_URL } from '../../../../config';
import fetchData from '../../../../utilities/fetch';

import './StoreHeader.scss';

class StoreHeader extends React.Component {
  handleClickWish = () => {
    if (!localStorage.getItem('TOKEN')) {
      alert('로그인 후 이용 가능한 서비스입니다');
      return;
    }

    const { is_wished } = this.props.restaurantsData;

    if (is_wished) {
      this.fetchIsWished('DELETE');
    } else if (!is_wished) {
      this.fetchIsWished('POST');
    }
  };

  fetchIsWished = method => {
    fetch(`${BASE_URL}/restaurants/${this.props.storeId}/wishlist`, {
      headers: {
        Authorization: localStorage.getItem('TOKEN'),
      },
      method: method,
    }).then(() => {
      fetchData(
        `restaurants/${this.props.storeId}`,
        localStorage.getItem('TOKEN')
          ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
          : null,
        {
          onSuccess: res => this.props.handleSetRestaurants(res.result),
        },
        { onReject: res => alert(res) }
      );
    });
  };

  render() {
    const { restaurantsData } = this.props;

    return (
      <header className="storeHeader">
        <div className="storeTitle">
          <h2>{restaurantsData.name}</h2>
          <strong>{restaurantsData.average_rating.toFixed(1)}</strong>
        </div>
        <div className="storeStatus">
          <i className="fas fa-pen"></i>
          <span>{restaurantsData.review_count.total}</span>
        </div>
        <div onClick={this.handleClickWish} className="wishBox">
          <i
            className={`fa-star ${restaurantsData.is_wished ? 'fas' : 'far'}`}
          ></i>
          <span>가고싶다</span>
        </div>
      </header>
    );
  }
}

export default StoreHeader;
