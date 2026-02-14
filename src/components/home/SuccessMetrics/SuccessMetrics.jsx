const SuccessMetrics = () => {
  return (
    <div className="bg-base-300 py-20 text-black">
      <div className="container mx-auto px-4">
        <div className="stats stats-vertical lg:stats-horizontal w-full">
          <div className="stat place-items-center">
            <div>Happy Families</div>
            <div className="stat-value">2,500+</div>
          </div>
          <div className="stat place-items-center">
            <div>Verified Caregivers</div>
            <div className="stat-value">450+</div>
          </div>
          <div className="stat place-items-center">
            <div>Total Care Hours</div>
            <div className="stat-value">120K+</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuccessMetrics;