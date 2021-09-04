import React from 'react';

import { BASE_URL } from '../../config';

import './SignUp.scss';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      nameValue: '',
      emailValue: '',
      passwordValue: '',
      phoneNumValue: '',
    };
  }

  controlInput = event => {
    const { value, name } = event.target;
    console.log(this.state);
    if (name === 'inputName') {
      this.setState({
        nameValue: value,
      });
    } else if (name === 'inputPassword') {
      this.setState({
        passwordValue: value,
      });
    } else if (name === 'inputEmail') {
      this.setState({
        emailValue: value,
      });
    } else {
      this.setState({
        phoneNumValue: value,
      });
    }
  };

  isAllValueValid = () => {
    const reg_pwd =
      /^(?=.*[a-z])(?=.+[A-Z])(?=.+\d)(?=.+[!@#$%^&*()-=_+])[a-zA-Z0-9`~!@#$%^&*()_+-=,./<>?]{6,25}$/; // 영문 소문자, 대문자, 숫자, 특수문자 1개 이상, 6글자
    const reg_phoneNum = /^01[1|2|5|7|8|9|0][0-9]{3,4}[0-9]{4}$/;
    const reg_email = /^[a-zA-Z0-9]+@[a-zA-Z0-9.]+\.[a-zA-Z0-9]+$/;
    const reg_name = /^[a-zA-Z가-힇0-9]{1,8}$/;

    const isPasswordValid = reg_pwd.test(this.state.passwordValue);
    const isPhoneNumValid = reg_phoneNum.test(this.state.phoneNumValue);
    const isEmailValid = reg_email.test(this.state.emailValue);
    const isNameValid = reg_name.test(this.state.nameValue);

    this.setState({
      isPasswordValid,
      isPhoneNumValid,
      isEmailValid,
      isNameValid,
    });
  };

  goToMain = e => {
    e.preventDefault();
    const { nameValue, emailValue, passwordValue, phoneNumValue } = this.state;

    const isValidAll =
      nameValue && emailValue && passwordValue && phoneNumValue;

    if (!isValidAll) return;

    fetch(`${BASE_URL}/users/signup`, {
      method: 'post',
      body: JSON.stringify({
        nickname: nameValue,
        email: emailValue,
        password: passwordValue,
        phone_number: phoneNumValue,
      }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'SUCCESS') {
          alert('싸우지망고의 회원이 되었어요!');
          this.props.closeSignUp();
        } else {
          alert('이미 있는 유저 정보입니다!');
        }
      });
  };

  render() {
    const { isPasswordValid, isPhoneNumValid, isEmailValid, isNameValid } =
      this.state;
    const isAllValueTrue =
      isPasswordValid && isPhoneNumValid && isEmailValid && isNameValid;

    return (
      <div className="modalBg">
        <form className="signUpForm" onSubmit={this.goToMain}>
          <div className="signUpLogo">
            <img className="logoImage" alt="logo" src="/images/mango.png" />
          </div>
          <div className="signUpTitle">회원가입</div>
          <div className="signUpContainer">
            <input
              type="text"
              name="inputName"
              className="inputName"
              placeholder="이름"
              onChange={this.controlInput}
              onKeyUp={this.isAllValueValid}
            />
            <input
              type="text"
              name="inputEmail"
              className="inputEmail"
              placeholder="이메일"
              onChange={this.controlInput}
              onKeyUp={this.isAllValueValid}
            />
            <input
              type="text"
              name="inputPhoneNum"
              className="inputPhoneNum"
              placeholder="전화번호"
              onChange={this.controlInput}
              onKeyUp={this.isAllValueValid}
            />
            <input
              type="password"
              name="inputPassword"
              className="inputPassword"
              placeholder="비밀번호"
              onChange={this.controlInput}
              onKeyUp={this.isAllValueValid}
            />
            <button
              type="submit"
              className="submitInfoBtn"
              disabled={!isAllValueTrue}
            >
              회원가입
            </button>
          </div>
          <div className="checkMembership">
            이미 가입 하셨나요? <a className="goToLogin">로그인</a>{' '}
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
