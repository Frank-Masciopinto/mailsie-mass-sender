import { API_ENDPOINTS, LS } from './constants.js';

export var API = {
  login: async function (data) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API_ENDPOINTS.logIn);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
          console.log(JSON.parse(xhr.response));
          var first_digit_response_status_number = String(xhr.status).charAt(0);
          if (first_digit_response_status_number == '4') {
            console.log('INSIDE ERROR');
            var obj = JSON.parse(xhr.response);
            alert('Email or password is incorect. Please try again.');
            resolve(false);
          } else {
            console.log('LOGIN SUCCESSFUL');
            var jsonResponse = JSON.parse(xhr.response);
            chrome.runtime.sendMessage({
              message: 'create_notification',
              title: 'Logged In',
              description: `You're logged in with email: ${jsonResponse['data']['email']}`,
            });
            if (jsonResponse['token']) {
              await LS.setItem('Auth_Token', jsonResponse['token']);
            }
            let userProfile = await LS.getItem('User_Profile');
            userProfile.email = data['email'];
            userProfile.auth_token = jsonResponse['token'];
            userProfile.password = data['password'];
            userProfile.name = jsonResponse['data']['name'];
            await LS.setItem('User_Profile', userProfile);
            if (jsonResponse['data']['sub_expires_at'] > 0) {
              await LS.setItem('user have paid?', true);
              chrome.runtime.sendMessage({
                message: 'create_notification',
                title: 'License Activated',
                description: 'Enjoy VScan Premium!',
              });
            } else {
              await LS.setItem('Is the user on free trial?', true);
            }
            resolve(true);
          }
        }
      };

      xhr.send(JSON.stringify(data));
    });
  },
  signup: async function (data) {
    return new Promise(function (resolve, reject) {
      console.log(data);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API_ENDPOINTS.signUp);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
          console.log(JSON.parse(xhr.response));
          var first_digit_response_status_number = String(xhr.status).charAt(0);
          if (first_digit_response_status_number == '4') {
            console.log('INSIDE ERROR');
            var obj = JSON.parse(xhr.response);
            alert(obj.error);
            resolve(false);
          } else {
            console.log('SIGNUP SUCCESSFUL');
            var jsonResponse = JSON.parse(xhr.response);
            chrome.runtime.sendMessage({
              message: 'create_notification',
              title: 'Signed up Successfully',
              description: `You're signed up with email: ${jsonResponse['data']['email']}`,
            });
            let userProfile = await LS.getItem('User_Profile');
            userProfile.email = data['email'];
            userProfile.auth_token = jsonResponse['token'];
            userProfile.password = data['password'];
            userProfile.name = jsonResponse['data']['name'];
            await LS.setItem('User_Profile', userProfile);
            if (jsonResponse['data']['sub_expires_at'] > 0) {
              await LS.setItem('user have paid?', true);
              chrome.runtime.sendMessage({
                message: 'create_notification',
                title: 'License Activated',
                description: 'Enjoy VScan Premium!',
              });
            } else {
              await LS.setItem('Is the user on free trial?', true);
            }
            resolve(true);
          }
        }
      };

      xhr.send(JSON.stringify(data));
    });
  },
  getUserProfile: async function getUserProfile() {
    console.log('getUserProfile()');
    return new Promise(async function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', CONST.check_user_payment_Url);

      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + (await LS.getItem('Auth_Token'))
      );

      xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          var json = JSON.parse(xhr.response);
          if (json.error) {
            console.log('INSIDE ERROR');
            console.log(json.error);
            if (json.error == 'invalid or expired token') {
              resolve('Token expired');
            }
            resolve(false);
          } else {
            console.log('SUCCESSFUL');
            if (json.data.sub_expires_at > 0) {
              await LS.setItem('user have paid?', true);
              resolve('Payment detected');
            }
            resolve(false);
          }
        }
      };

      xhr.send(JSON.stringify());
    });
  },
  updateAuthToken: async function (tabIDupdateToken) {
    console.log('updateAuthToken()');
    return new Promise(async function (resolve, reject) {
      var login_data = `{
              "email":"${await LS.getItem('email')}",
              "sessionId":"${await LS.getItem('sessionId')}",
              "authTokenGenerated": true,
              "password":"${await LS.getItem('password')}"}`;
      let json_Str = JSON.stringify(login_data);
      console.log(json_Str);
      let json_Login = JSON.parse(json_Str);
      fetch(CONST.login_API_URL, {
        // Adding method type
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: json_Login,
      })
        // Converting to JSON
        .then((response) => response.json())
        .then(async (xhr) => {
          console.log(xhr);
          if (xhr.success != true || !xhr) {
            console.log('INSIDE ERROR');
            try {
              console.log(xhr);
            } catch {}
            resolve('error');
            chrome.tabs.sendMessage(
              tabIDupdateToken,
              { message: 'Response Update Token', result: 'Error' },
              (response) => {}
            );
          } else {
            console.log('LOGIN SUCCESSFUL');
            var jsonResponse = xhr;
            if (jsonResponse['data']['sub_expires_at'] > 0) {
              await LS.setItem('user have paid?', true);
            }
            if (jsonResponse['multiloginDetected'] == true) {
              console.log('multiloginDetected');
              chrome.tabs.sendMessage(
                tabIDupdateToken,
                {
                  message: 'Response Update Token',
                  result: 'Multilogin Detected, after new login to fetch token',
                },
                (response) => {}
              );
              resolve('Multilogin Detected, after new login to fetch token');
              //await LS.setItem('Auth_Token', jsonResponse["token"]);
            } else {
              chrome.tabs.sendMessage(
                tabIDupdateToken,
                {
                  message: 'Response Update Token',
                  result: 'Multilogin Undetected',
                },
                (response) => {}
              );
              await LS.setItem('Auth_Token', jsonResponse['token']);
            }
            resolve('success');
          }
        });
    });
  },
  getAuthToken: async function () {
    console.log('getAuthToken()');
    return new Promise(async function (resolve, reject) {
      var login_data = `{
              "email":"${await LS.getItem('email')}",
              "password":"${await LS.getItem('password')}"}`;
      let json_Str = JSON.stringify(login_data);
      let json_Login = JSON.parse(json_Str);
      fetch(CONST.login_API_URL, {
        // Adding method type
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: json_Login,
      })
        // Converting to JSON
        .then((response) => response.json())
        .then(async (xhr) => {
          console.log(xhr);
          if (xhr.success != true || !xhr) {
            console.log('INSIDE ERROR');
            try {
              console.log(xhr);
            } catch {}
            resolve('error');
            chrome.tabs.sendMessage(
              tabIDupdateToken,
              { message: 'Response Update Token', result: 'Error' },
              (response) => {}
            );
          } else {
            console.log('SUCCESSFUL');
            var jsonResponse = xhr;
            if (jsonResponse['data']['sub_expires_at'] > 0) {
              await LS.setItem('user have paid?', true);
            }
            if (jsonResponse['token'] == (await LS.getItem('Auth Token'))) {
              //No Multilogin, token expired
              resolve('Token Expired, updateAuthToken next');
            } else {
              resolve('Multilogin Detected');
            }
          }
        });
    });
  },
};
