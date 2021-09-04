import React from 'react';
import { withRouter } from 'react-router';

import { BASE_URL } from '../../../../config';

import RatingStar from './RatingStar/RatingStar';

import './ReviewInput.scss';

class ReviewInput extends React.Component {
  state = {
    isTextValid: false,
    isRatingValid: false,
    reviewRating: 0,
    reviewInput: '',
  };

  fetchReviewInput = () => {
    const { reviewRating, reviewInput } = this.state;
    const { fetchReviewData } = this.props;

    fetch(`${BASE_URL}/restaurants/${this.props.storeId}/reviews`, {
      headers: {
        Authorization: localStorage.getItem('TOKEN'),
      },
      method: 'POST',
      body: JSON.stringify({
        rating: reviewRating,
        content: reviewInput,
      }),
    }).then(fetchReviewData);
  };

  handleReviewSubmit = e => {
    e.preventDefault();

    if (!localStorage.getItem('TOKEN')) {
      alert('로그인 후 이용 가능한 서비스입니다');
      return;
    }

    this.fetchReviewInput();
    this.setState({
      reviewInput: '',
      reviewRating: 0,
      isRatingValid: false,
      isTextValid: false,
    });
  };

  handleReviewInput = e => {
    const isTextValid = e.target.value.length > 9;
    this.setState({ isTextValid, reviewInput: e.target.value });
  };

  handleReviewRating = index => {
    this.setState({
      isRatingValid: true,
      reviewRating: index + 1,
    });
  };

  render() {
    const { reviewRating, isTextValid, isRatingValid } = this.state;
    const { storeName } = this.props;

    return (
      <form className="reviewInputForm">
        <p className="reviewTitle">
          <b>{storeName}</b>에 대한 솔직한 리뷰를 써주세요
        </p>
        <div className="reviewInputBox">
          <div className="reviewRatingBox">
            {[...Array(5)].map((_, index) => (
              <RatingStar
                key={index}
                idx={index}
                reviewRating={reviewRating}
                handleReviewRating={this.handleReviewRating}
              />
            ))}
          </div>
          <textarea
            value={this.state.reviewInput}
            onChange={this.handleReviewInput}
            placeholder="주문하신 메뉴는 어떠셨나요? 식당의 분위기와 서비스도 궁금해요!"
          />
        </div>
        <button
          className="reviewSubmitBtn"
          onClick={this.handleReviewSubmit}
          disabled={!(isTextValid && isRatingValid)}
        >
          리뷰작성
        </button>
      </form>
    );
  }
}

export default withRouter(ReviewInput);
