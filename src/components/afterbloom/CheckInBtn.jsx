export default function CheckInBtn({ label = "Complete today's check-in", onCheckIn }) {
  return (
    <button type="button" className="ci-btn" onClick={onCheckIn}>
      <div className="ci-btn__content">
        <svg className="ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
        </svg>
        {label}
      </div>
    </button>
  );
}
