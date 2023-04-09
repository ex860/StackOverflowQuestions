import react, { useContext } from 'react';
import SearchContext from '../SearchContext';
import highlight from '../highlightSearchString';
import classNames from 'classnames';
import './Tag.scss';

const Tag = (props) => {
    const { name, isSelected, onTagClick } = props;
    const { searchString } = useContext(SearchContext);
    return (
        <button
            className={classNames(['tag', isSelected && 'tag--selected'])}
            onClick={() => onTagClick(name, isSelected)}
        >
            {highlight(name, searchString)}
        </button>
    );
};
export default Tag;
