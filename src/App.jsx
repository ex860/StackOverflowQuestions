'use strict';

import { useEffect, useState, useRef, createContext } from 'react';
import Question from './question-list/Question';
import Tag from './tag/Tag';
import he from 'he';
import Loading from './loading/Loading';
import SearchBar from './search-bar/SearchBar';
import SearchContext from './SearchContext';
import './App.scss';

const getTaggedString = tags => {
  return tags.map(tag => tag.isSelected && tag.name).filter(Boolean).join(';');
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const observerRef = useRef(null);
  const getQuestions = (taggedString, page = 1, resetQuestionList = false) => {
    fetch(`https://api.stackexchange.com/2.3/questions?page=${page}&pagesize=20&order=desc&sort=activity&tagged=${taggedString}&site=stackoverflow`)
      .then(res => res.json())
      .then(result => {
        if (Array.isArray(result?.items)) {
          setQuestions(resetQuestionList ? result.items : questions.concat(result.items));
          setCurrentPage(page);
        }
      });
  };
  const firstFetch = () => {
    fetch('https://api.stackexchange.com/2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow')
      .then(res => res.json())
      .then(result => {
        if (Array.isArray(result?.items)) {
          const tags = result.items.map((item, index) => ({ ...item, isSelected: !index }));
          setTags(tags);
          getQuestions(tags[0]?.name);
        }
      });
  };
  useEffect(() => {
    firstFetch();
  }, []);
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && questions.length) {
          loadingObserver.unobserve(entry.target);
          getQuestions(getTaggedString(tags), currentPage + 1);
        }
      });
    };
    const loadingObserver = new IntersectionObserver(callback, {});
    if (!searchString) {
      loadingObserver.observe(observerRef.current);
    }
    return () => {
      loadingObserver.disconnect();
    };
  }, [questions, searchString]);

  const handleTagClick = (tagName, isSelected) => {
    const newTags = tags.map(tag => {
      if (tag.name === tagName) {
        tag.isSelected = !isSelected;
      }
      return tag;
    });
    setTags(newTags);
  };
  const onSearch = str => {
    setSearchString(str.toLowerCase());
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
    return matchedTags.map(tag => <Tag key={tag.name} onTagClick={handleTagClick} {...tag} />);
  };
  const renderQuestions = () => {
    if (!questions || !questions.length) {
      return null;
    }
    const matchedQuestions = questions.filter(question => {
      if (!Array.isArray(question.tags)) {
        return false;
      }
      const tagNameMap = new Map(question.tags.map(tag => [tag, true]));
      const selectedTagNames = tags.map(tag => tag.isSelected && tag.name).filter(Boolean);
      const isMatchedAllTags = selectedTagNames.every(tagName => tagNameMap.has(tagName));
      return isMatchedAllTags && (checkStringIsMatched(he.decode(question?.title)) || checkStringIsMatched(question?.owner?.display_name));
    });
    return matchedQuestions.map(question => <Question key={question.question_id} {...question} />);
  };
  return (
    <SearchContext.Provider value={{ searchString }}>
      <div className="App">
        <div className='header'>
          <h1>Stack Overflow Questions</h1>
          <SearchBar onSearch={onSearch} />
        </div>
        <div className='main-section'>
          <div className='main-section__tags'>
            {renderTags()}

          </div>
          <div className='main-section__question-list'>
            {renderQuestions()}
          </div>
        </div>
        {!searchString && (
          <div className='loading-observer' ref={observerRef}>
            <Loading />
          </div>
        )}
      </div>
    </SearchContext.Provider>
  );
}

export default App;
