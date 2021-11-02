/* eslint-disable react/style-prop-object */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
const RegisterPage = () => {
  return (
    <div className='token-policy'>
      <div className='token-policy-header'>Token Policy</div>
      <div className='token-policy-part'>
        <div className='token-policy-title'>1. What are tokens?</div>
        <div className='token-policy-content'>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tokens are generated as a way to calculate points, 1 unit of in-app
            currency. Tokens are valid only within the application and cannot be exchanged for any other currency. Users
            cannot use real money to buy tokens nor can they exchange tokens for real money.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Token is created with the purpose of encouraging users to interact with
            the page, creating a fair and fun playing field among users participating in the application.
          </p>
        </div>
      </div>
      <div className='token-policy-part'>
        <div className='token-policy-title'>2. How to Earn In-App Tokens?</div>
        <div className='token-policy-content'>
          <ul>
            <li>When the user's post is approved, the user will receive 20 tokens</li>
            <li>
              When a user likes a post, the person who likes it gets 1 token and the person who creates the meme gets 5
              tokens
            </li>
            <li>When the article is shared, share-er and post creator both get 3 tokens</li>
            <li>When successfully reporting 1 post, the reporter gets 10 tokens</li>
            <li>When successfully reporting another user, the reporter gets 20 tokens</li>
          </ul>
        </div>
      </div>

      <div className='token-policy-part'>
        <div className='token-policy-title'>3. How to use tokens?</div>
        <div className='token-policy-content'>
          <ul>
            <li className='topic'>
              Give tokens to other users
              <ul>
                <li>User can go to another user's profile to donate tokens as desired with a message</li>
              </ul>
            </li>
            <li className='topic'>
              Top hot meme
              <ul>
                <li>
                  By default, 1 post needs 1000 tokens to get hot, each user can only push up to 20% of the default
                  number of tokens (200 tokens). Thus, if you want a post to be completely hot with tokens, you need at
                  least 5 people to push it together. This is a balancing factor and community of the system, avoiding
                  users with many tokens to push hot posts with bullshit content.
                </li>
                <li>
                  The number of tokens that need to be pushed is reduced by 100 when a post has 1 like or 1 share, until
                  the token drops to 0, it will be automatically hot (for each post 1 user can only share that post up
                  to 1 time a day)
                </li>
                <li>
                  In addition, if the total number of likes of a post reaches 20% of the total number of active users,
                  that post will be eligible to be hot (Each user can only like a post once).
                </li>
              </ul>
            </li>
            <li className='topic'>
              Advertisement
              <ul>
                <li>
                  Users can use tokens to push their own ads onto the system, ads will be displayed as a post on the
                  homepage if approved.
                </li>
                <li>If the ads is not approved, the token will be returned to that user</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
