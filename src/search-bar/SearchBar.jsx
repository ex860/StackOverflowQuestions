import './SearchBar.scss';

const debounce = (fn, timeout) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, timeout);
    };
};

const SearchBar = props => {
    const { onSearch } = props;
    const onChange = debounce((event) => {
        if (event?.target && onSearch) {
            const { value } = event.target;
            onSearch(value);
        }
    }, 300);
    return (
        <div className="search-bar">
            <input onChange={onChange}></input>
            <button className="search-bar__search-btn">Search</button>
        </div>
    );
};
export default SearchBar;
