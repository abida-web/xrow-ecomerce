import React from "react";

const InvitationsTab = ({
  invitations,
  handleCancelInvitation,
}: {
  invitations: any[];
  handleCancelInvitation: (invitationId: string) => void;
}) => {
  return (
    <div>
      {invitations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending invitations
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Expires
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invitations
                .filter((inv) => inv.status === "pending")
                .map((invitation: any, index: number) => (
                  <tr
                    key={invitation.id || index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {invitation.email || invitation.invitedEmail}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {invitation.role}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {invitation.expiresAt
                        ? new Date(invitation.expiresAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="text-xs flex gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
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

export default InvitationsTab;
