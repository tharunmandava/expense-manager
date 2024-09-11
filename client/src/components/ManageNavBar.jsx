import React from "react";
import { NavLink, useParams } from "react-router-dom";

const ManageNavBar = () => {
  const { id } = useParams(); // Get the group ID from the URL params

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-center gap-8 list-none m-0 p-0">
        <li>
          <NavLink
            to={`/groups/${id}/expenses`}
            className={({ isActive }) =>
              isActive ? "text-gold" : "text-white"
            }
          >
            Expenses
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/groups/${id}/balances`}
            className={({ isActive }) =>
              isActive ? "text-gold" : "text-white"
            }
          >
            Balances
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/groups/${id}/more`}
            className={({ isActive }) =>
              isActive ? "text-gold" : "text-white"
            }
          >
            More
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/groups/${id}/settings`}
            className={({ isActive }) =>
              isActive ? "text-gold" : "text-white"
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ManageNavBar;
