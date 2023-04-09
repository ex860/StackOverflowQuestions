import react from 'react';
import classNames from 'classnames';
import './Tag.scss';

const Tag = (props) => {
    const { name, isSelected, onTagClick, searchString } = props;
    const renderName = () => {
        const startIndex = name.indexOf(searchString);
        if (!searchString || startIndex === -1) {
            return name;
        }

        return (
            <>
                {name.slice(0, startIndex)}
                <span className='highlight'>{searchString}</span>
                {name.slice(startIndex + searchString.length)}
            </>
        );
    };
    return (
        <button
            className={classNames(['tag', isSelected && 'tag--selected'])}
            onClick={() => onTagClick(name, isSelected)}
        >
            {renderName()}
        </button>
    );
};
export default Tag;
