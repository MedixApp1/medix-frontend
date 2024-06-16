import './style.scss';
import ReviewCard from './ReviewCard';
import reviewsData from './reviews.data';
import { useState, useRef } from 'react';

function Reviews() {
	const [position, setPosition] = useState(0);
	const reviewElement = useRef<HTMLDivElement>(null);
	const reviewContainer = useRef<HTMLDivElement>(null);

	const movePositionLeft = () => {
		const reviewElementWidth = reviewElement.current!.offsetWidth;
		setPosition((prev) => (prev >= 0 ? prev : prev + reviewElementWidth));
	};

	const movePositionRight = () => {
		const reviewElementWidth = reviewElement.current!.offsetWidth;
		const reviewContainerWidth = reviewContainer.current!.offsetWidth;
		setPosition((prev) =>
			prev <= -reviewContainerWidth + window.innerWidth
				? prev
				: prev - reviewElementWidth
		);
	};
	return (
		<section id='reviews' className="reviews__section">
			<h2>Reviews</h2>
			<p>
				Feel free to share your thoughts, suggestions, and experiences with
				us—wer&apos;e here to listen and continuously improve based on your
				individual viewpoint
			</p>
			<div className="review__parent__container">
				<div
					ref={reviewContainer}
					className="review__card__container"
					style={{ transform: `translateX(${position}px)` }}
				>
					{reviewsData.map((review, i) => (
						<ReviewCard
							key={i}
							name={review.name}
							title={review.title}
							index={i + 1}
							comment={review.comment}
							position={review.position}
							ref={reviewElement}
						/>
					))}
				</div>
			</div>
			<div className="review__btns">
				<button onClick={movePositionLeft}>
					{' '}
					<img
						height={40}
						width={100}
						src="/icons/arrow-right.svg"
						alt=""
                  className='arrow__left'
					/>
				</button>
				<button onClick={movePositionRight}>
					<img
						height={40}
						width={100}
						src="/icons/arrow-right.svg"
						alt=""
					/>
				</button>
			</div>
		</section>
	);
}
export default Reviews;