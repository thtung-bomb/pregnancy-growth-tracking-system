import React from "react";

interface StatusOrderDropdownProps {
  onSelect: (status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCEL' | '') => void;
}

const StatusOrderDropdown: React.FC<StatusOrderDropdownProps> = ({ onSelect }) => {
  const statuses: Array<'PENDING' | 'PAID' | 'COMPLETED' | 'CANCEL' | ''> = ['PENDING', 'PAID', 'COMPLETED', 'CANCEL', ''];

  return (
    <div className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg">
      {statuses.map((status) => (
        <div
          key={status}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(status)}
        >
          {status || "All"}
        </div>
      ))}
    </div>
  );
};

export default StatusOrderDropdown;