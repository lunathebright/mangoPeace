import React from 'react';
import { withRouter } from 'react-router';

import { stringToQuery } from '../../../utilities/query';

import ReviewInput from './ReviewInput/ReviewInput';
import ReviewLi from './ReviewLi/ReviewLi';
import ReviewEmpty from './ReviewEmpty/ReviewEmpty';

import './StoreReviewBox.scss';

class StoreReviewBox extends React.Component {
  state = {
    selectedRateGroup: 0,
  };

  sortScoreData = [
    {
      text: '전체',
      quantity: this.props.restaurantsData.review_count.total,
      min: 1,
      max: 5,
    },
    {
      text: '맛있다',
      quantity:
        this.props.restaurantsData.review_count.rating_four +
        this.props.restaurantsData.review_count.rating_five,
      min: 4,
      max: 5,
    },
    {
      text: '괜찮다',
      quantity: this.props.restaurantsData.review_count.rating_three,
      min: 3,
      max: 3,
    },
    {
      text: '별로',
      quantity:
        this.props.restaurantsData.review_count.rating_one +
        this.props.restaurantsData.review_count.rating_two,
      min: 1,
      max: 2,
    },
  ];

  handleClickSortScore = index => {
    const { history } = this.props;

    history.push(
      `?offset=0&limit=10&rating-min=${this.sortScoreData[index].min}&rating-max=${this.sortScoreData[index].max}`
    );
    this.props.fetchReviewData();
    this.setState({ selectedRateGroup: index });
  };

  handleClickViewMore = () => {
    const { history } = this.props;
    const queryObj = stringToQuery(history.location.search);

    history.push(
      `?offset=${Number(queryObj.offset) + 10}&limit=10&rating-min=${
        queryObj['rating-min']
      }&rating-max=${queryObj['rating-max']}`
    );
    this.props.fetchReviewData();
  };

  render() {
    const {
      reviewsData,
      restaurantsData,
      handleReviewDel,
      handleReviewEdit,
      fetchReviewData,
      storeId,
      history,
    } = this.props;
    const { selectedRateGroup } = this.state;
    const queryObj = stringToQuery(history.location.search);

    return (
      <div className="storeReviewBox">
        <ReviewInput
          fetchReviewData={fetchReviewData}
          storeId={storeId}
          storeName={restaurantsData.name}
        />
        <section className="reviewListBox">
          <ul className="sortScore">
            {this.sortScoreData.map((sort, i) => (
              <li
                className={i === selectedRateGroup ? 'on' : null}
                onClick={() => this.handleClickSortScore(i)}
                key={i}
              >
                {sort.text}
                <b>({sort.quantity})</b>
              </li>
            ))}
          </ul>
          <ul className="reviewUl">
            {reviewsData.length === 0 ? (
              <ReviewEmpty />
            ) : (
              reviewsData.map(review => (
                <ReviewLi
                  key={review.id}
                  storeId={storeId}
                  handleReviewDel={handleReviewDel}
                  handleReviewEdit={handleReviewEdit}
                  reviewId={review.id}
                  reviewUserInfo={review.user}
                  reviewContent={review.content}
                  reviewRate={review.rating}
                  createdAt={review.created_at}
                />
              ))
            )}
          </ul>
        </section>
        {queryObj.offset + queryObj.limit <
          this.sortScoreData[selectedRateGroup].quantity && (
          <div className="viewMoreBox">
            <span onClick={this.handleClickViewMore} className="viewMoreText">
              더보기
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(StoreReviewBox);
