import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css'

export default class Home extends Component {
  render() {
    return (
      <div className='header'>
        <div className='header-title'>
          <div className='header-titles'>
            <li className='header-link'>
              <Link class="link" to="/photo">Photo Input</Link>
            </li>
            <li className='header-link1'>
              <Link class="link" to="/camera">Video Camera</Link>
            </li>
          </div>
        </div>
        <div className='header-text'>
          <h2>BNK48 Facial Recognition App</h2>
        </div>
      </div>
    );
  }
}
