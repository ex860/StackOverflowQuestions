import react, { useContext } from 'react';
import SearchContext from '../SearchContext';
import highlight from '../highlightSearchString';
import classNames from 'classnames';
import he from 'he';
import User from './User';
import './Question.scss';

const Question = (props) => {
    const { owner, title, link, score, view_count, answer_count, accepted_answer_id } = props;
    const { searchString } = useContext(SearchContext);
    const isMinusScore = score < 0;
    const isAccepted = !!accepted_answer_id;
    return (
        <a className="question-link" href={link} target='_blank' rel="noopener">
            <div className="question">
                <div className={classNames(['question__score', isMinusScore && 'question__score--minus'])}>
                    {score}
                </div>
                <div className='question__main'>
                    <div className='question__main__title'>{highlight(he.decode(title), searchString)}</div>
                    <div className='question__main__ans-and-view'>
                        <div className={classNames([
                            'question__main__ans-and-view__answer',
                            isAccepted && 'question__main__ans-and-view__answer--accepted',
                            answer_count > 0 && 'question__main__ans-and-view__answer--has-answer',
                        ])}>
                            answer: {answer_count}
                        </div>
                        <div className='question__main__ans-and-view__view'>view: {view_count}</div>
                    </div>
                    <div className="question__main__owner">
                        <User {...owner} />
                    </div>
                </div>
            </div >
        </a>
    );
};
export default Question;
