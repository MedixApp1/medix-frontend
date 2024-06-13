import { forwardRef } from 'react';
import { LegacyRef } from 'react';

type ReviewCardProps = {
   name: string;
   title: string;
   index: number;
   comment: string;
   position: string;
}

const ReviewCard = forwardRef(
	({ name, title, index, comment, position }: ReviewCardProps, ref: LegacyRef<HTMLDivElement>) => {
		return (
			<article className="review__card" ref={ref}>
				<h2>{`"${title}"`}</h2>
				<p>{comment}</p>
				<div className="customer__details">
					<img src={`/reviews/review-${index}.jpg`} alt="" />
					<div>
						<h3>{name}</h3>
						<p>{position}</p>
					</div>
				</div>
			</article>
		);
	}
);


ReviewCard.displayName = 'ReviewCard';
export default ReviewCard;