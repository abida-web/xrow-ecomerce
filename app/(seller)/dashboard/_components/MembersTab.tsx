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
}: {
  members: Member[];
  handleRemoveMember?: (memberId: string) => void;
}) => {
  return (
    <div>
      {!members || members.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No members found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr
                  key={member.id || index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{member.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {handleRemoveMember && (
                      <button
                        onClick={() =>
                          handleRemoveMember(member.userId || member.id)
                        }
                        className="text-xs flex gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    )}
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
