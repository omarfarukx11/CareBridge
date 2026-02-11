const SuccessMetrics = () => {
  return (
    <div className="bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat place-items-center">
            <div className="stat-title">Happy Families</div>
            <div className="stat-value text-primary">2,500+</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Verified Caregivers</div>
            <div className="stat-value text-secondary">450+</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Total Care Hours</div>
            <div className="stat-value">120K+</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuccessMetrics;