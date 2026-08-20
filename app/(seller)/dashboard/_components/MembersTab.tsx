import React from "react";

interface Member {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  image?: string | null;
}

const MembersTab = ({
  members,
  handleRemoveMember,
  handleUpdateRole,
}: {
  members: Member[];
  handleRemoveMember: (memberId: string) => void;
  handleUpdateRole: (memberId: string, role: string) => void;
}) => {
  return (
    <div>
      {!members || members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No members found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Joined Date
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr
                  key={member.id || index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-gray-800 font-medium">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-700">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-black">
                    <ul className="menu bg-whites rounded-box w-56">
                      <li>
                        <details>
                          <summary>Actions</summary>
                          <ul>
                            <li className="bg-[#ffb4b7] transition-all duration-300 hover:bg-red-500 hover:text-white rounded-lg">
                              <a>Remove</a>
                            </li>

                            <li>
                              <details open>
                                <summary>Change role</summary>
                                <select
                                  id="role"
                                  value={member.role}
                                  onChange={(e) => {
                                    handleUpdateRole(member.id, e.target.value);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 appearance-none bg-white text-gray-900"
                                >
                                  <option value="driver">Driver</option>
                                  <option value="staff">Staff</option>
                                  <option value="owner">Owner</option>
                                  <option value="member">Member</option>
                                </select>
                              </details>
                            </li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersTab;
