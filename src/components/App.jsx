import React from 'react';
import Article from './Article.jsx';
import axios from 'axios';

// 정상적이라면 로그인 요청 후, 저장해야 합니다. 현재 브랜치에서는 로그인 기능이 없기 때문에 변수로 선언해서 사용합니다.
const AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhYWFhYSIsImlhdCI6MTUxNDU0NzI4MSwiZXhwIjoxNTE0NjMzNjgxfQ.4n1vsblYOEHIinl9_bwnsHWA_QU6qbxomNW6ZaRsOvw';

// 이용 가능한 섹션 정보들
const SECTIONS = [
  'home',
  'opinion',
  'world',
  'national',
  'politics',
  'upshot',
  'nyregion',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'arts',
  'books',
  'movies',
  'theater',
  'sundayreview',
  'fashion',
  'tmagazine',
  'food',
  'travel',
  'magazine',
  'realestate',
  'automobiles',
  'obituaries',
  'insider'
];

/* Day 6: Connecting NY Times data */

// 1. Look at NSS-API document

// 2. Create UI for section selection

// 3. Call NSS-API Endpoint on section name click

// 4. React Component Lifecycle Hooks
// Doc: https://reactjs.org/docs/react-component.html

// 5. Re-render upon receiving new data

export default class App extends React.Component {
  constructor(props) {
    console.log('constructor');

    super(props);

    this.state = {
      articles: [],
      isLoading: false
    };
  }

  componentWillMount() {
    console.log('componentWillMount');
  }

  componentDidMount() {
    console.log('componentDidMount');

    axios.get('http://localhost:8081/top-stories/home', {
      headers: {
        Authorization: AUTH,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.setState({
        articles: response.data.results,
        isLoading: false
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  onSectionSelect(ev) {
    if (ev.target === ev.currentTarget) {
      return;
    }

    this.setState({
      isLoading: true
    });

    axios.get(`http://localhost:8081/top-stories/${ev.target.textContent}`, {
      headers: {
        Authorization: AUTH,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.setState({
        articles: response.data.results,
        isLoading: false
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    console.log('render');

    return (
      <div className="home">
        {
          this.state.isLoading &&
          <div>Loading...</div>
        }
        <ul className="selection" onClick={this.onSectionSelect.bind(this)}>
          {
            SECTIONS.map((sectionName, i) => {
              return <li key={i}>{sectionName}</li>
            })
          }
        </ul>
        {
          this.state.articles.map((data, i) => {
            return <Article
              url={data.short_url}
              mainHeadline={data.title}
              key={i}
              thumbnailURL={data.multimedia.length ? data.multimedia[1].url : null}
              publishedDate={data.published_date}
            />
          })
        }
      </div>
    );
  }
}
