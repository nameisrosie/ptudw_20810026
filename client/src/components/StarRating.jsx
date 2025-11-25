export default function StarRating({ rating }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={`fa fa-star${
            i < rating ? " text-warning" : " text-secondary"
          }`}
        />
      ))}
    </>
  );
}
