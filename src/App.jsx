'use strict';

import { useEffect, useState, useRef } from 'react';
import Question from './question-list/Question';
import Tag from './tag/Tag';
import he from 'he';
import LoadingMask from './loading-mask/LoadingMask';
import SearchBar from './search-bar/SearchBar';
import './App.scss';

const getTaggedString = tags => {
  return tags.map(tag => tag.isSelected && tag.name).filter(Boolean).join(';');
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchString, setSearchString] = useState('');
  const observerRef = useRef(null);
  const getQuestions = (taggedString, pagesize = 20) => {
    fetch(`https://api.stackexchange.com/2.3/questions?pagesize=${pagesize}&order=desc&sort=activity&tagged=${taggedString}&site=stackoverflow`)
      .then(res => res.json())
      .then(result => {
        setQuestions(questions.concat(result.items));
      });
  };
  const firstFetch = () => {
    fetch('https://api.stackexchange.com/2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow')
      .then(res => res.json())
      .then(result => {
        const tags = result.items.map((item, index) => ({ ...item, isSelected: !index }));
        setTags(tags);
        getQuestions(tags[0].name);
      });
  };
  useEffect(() => {
    firstFetch();
  }, []);
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && questions.length) {
          observer.unobserve(entry.target);
          getQuestions(getTaggedString(tags));
        }
      });
    };
    const observer = new IntersectionObserver(callback, {});
    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [questions]);

  const handleTagClick = (tagName, isSelected) => {
    const newTags = tags.map(tag => {
      if (tag.name === tagName) {
        tag.isSelected = !isSelected;
      }
      return tag;
    });
    setTags(newTags);
    getQuestions(getTaggedString(newTags));
  };
  const onSearch = searchString => {
    setSearchString(searchString.toLowerCase());
  };
  const checkStringIsMatched = targetString => {
    if (typeof targetString !== 'string') {
      return false;
    }
    return targetString.toLowerCase().includes(searchString);
  };
  const renderTags = () => {
    if (!tags || !tags.length) {
      return null;
    }
    const matchedTags = tags.filter(tag => checkStringIsMatched(tag.name));
    return matchedTags.map(tag => <Tag key={tag.name} onTagClick={handleTagClick} {...tag} searchString={searchString} />);
  };
  const renderQuestions = () => {
    if (!questions || !questions.length) {
      return null;
    }
    const matchedQuestions = questions.filter(question =>
      checkStringIsMatched(he.decode(question?.title)) || checkStringIsMatched(question?.owner?.display_name));
    return matchedQuestions.map(question => <Question key={question.question_id} {...question} searchString={searchString} />);
  };
  return (
    <div className="App">
      <div className='header'>
        <h1>Stack Overflow Questions</h1>
        <SearchBar onSearch={onSearch} />
      </div>
      <div className='main'>
        <div className='main__tags'>
          {renderTags()}

        </div>
        <div className='main__question-list'>
          {renderQuestions()}
          {/* <LoadingMask /> */}
        </div>
      </div>
      <div className='loading-observer' ref={observerRef}></div>
    </div>
  );
}

export default App;
