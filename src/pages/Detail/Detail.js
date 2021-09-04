import React from 'react';

import { stringToQuery } from '../../utilities/query';
import fetchData from '../../utilities/fetch';
import { BASE_URL } from '../../config';

import StoreImgBox from './StoreImgBox/StoreImgBox';
import StoreInfo from './StoreInfo/StoreInfo';
import StoreReviewBox from './StoreReviewBox/StoreReviewBox';

import './Detail.scss';

const LIMIT = 10;

class Detail extends React.Component {
  state = {
    restaurants: null,
    foods: null,
    reviews: null,
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;

    this.props.history.push(`?offset=0&limit=10&rating-min=1&rating-max=5`);

    fetchData(
      `restaurants/${id}`,
      localStorage.getItem('TOKEN')
        ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
        : null,
      {
        onSuccess: res => this.setState({ restaurants: res.result }),
      },
      { onReject: res => alert(res) }
    );
    fetchData(
      `restaurants/${id}/foods`,
      localStorage.getItem('TOKEN')
        ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
        : null,
      {
        onSuccess: res => this.setState({ foods: res.result }),
      },
      { onReject: res => alert(res) }
    );
    this.fetchReviewData();
  };

  componentDidUpdate = prevProps => {
    const { id } = this.props.match.params;

    if (prevProps.match.params.id !== id) {
      this.props.history.push(`?offset=0&limit=10&rating-min=1&rating-max=5`);

      fetchData(
        `restaurants/${id}`,
        localStorage.getItem('TOKEN')
          ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
          : null,
        {
          onSuccess: res => this.setState({ restaurants: res.result }),
        },
        { onReject: res => alert(res) }
      );
      fetchData(
        `restaurants/${id}/foods`,
        localStorage.getItem('TOKEN')
          ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
          : null,
        {
          onSuccess: res => this.setState({ foods: res.result }),
        },
        { onReject: res => alert(res) }
      );
      this.fetchReviewData();
    }
  };

  handleReviewEdit = reviewId => {
    const targetedReview = this.state.reviews.filter(
      review => review.id === reviewId
    );
    const targetedReviewText = targetedReview[0].content;
    const targetedReviewStar = targetedReview[0].rating;
    // fetch(
    //   `${BASE_URL}/restaurants/${this.props.match.params.id}/review/${reviewId}`,
    //   {
    //     method: 'PATCH',
    //   }
    // )
    //   .then(res => res.json())
    //   .then(res => console.log(res));
  };

  handleReviewDel = reviewId => {
    const { id } = this.props.match.params;

    fetch(`${BASE_URL}/restaurants/${id}/review/${reviewId}`, {
      method: 'DELETE',
    }).then(this.fetchReviewData);
  };

  fetchReviewData = () => {
    const { match, history } = this.props;
    const queryObj = stringToQuery(history.location.search);

    fetch(
      `${BASE_URL}/restaurants/${match.params.id}/reviews?offset=${queryObj.offset}&limit=${LIMIT}&rating-min=${queryObj['rating-min']}&rating-max=${queryObj['rating-max']}`
    )
      .then(res => res.json())
      .then(res => {
        if (Number(queryObj.offset) === 0) {
          this.setState({ reviews: res.result });
        } else {
          this.setState(prev => {
            return { reviews: [...prev.reviews, ...res.result] };
          });
        }
        fetchData(
          `restaurants/${match.params.id}`,
          localStorage.getItem('TOKEN')
            ? { headers: { Authorization: localStorage.getItem('TOKEN') } }
            : null,
          {
            onSuccess: res => this.setState({ restaurants: res.result }),
          },
          { onReject: res => alert(res) }
        );
      });
  };

  handleSetRestaurants = res => {
    this.setState({ restaurants: res });
  };

  render() {
    const { restaurants, foods, reviews } = this.state;

    return (
      <section className="detailPage">
        {foods && <StoreImgBox foodsData={foods} />}
        <div className="detailMain">
          {restaurants && foods && (
            <StoreInfo
              storeId={this.props.match.params.id}
              restaurantsData={restaurants}
              foodsData={foods}
              handleSetRestaurants={this.handleSetRestaurants}
            />
          )}
          {reviews && restaurants && (
            <StoreReviewBox
              storeId={this.props.match.params.id}
              fetchReviewData={this.fetchReviewData}
              handleReviewDel={this.handleReviewDel}
              handleReviewEdit={this.handleReviewEdit}
              restaurantsData={restaurants}
              reviewsData={reviews}
            />
          )}
        </div>
      </section>
    );
  }
}

export default Detail;
