import { createElement } from 'react';
const highlightSearch = (target, search) => {
    const startIndex = target.toLowerCase().indexOf(search);
    if (!search || startIndex === -1) {
        return target;
    }

    return [
        target.slice(0, startIndex),
        createElement('span', { className: 'highlight' }, target.slice(startIndex, startIndex + search.length)),
        target.slice(startIndex + search.length)
    ];
};
export default highlightSearch;