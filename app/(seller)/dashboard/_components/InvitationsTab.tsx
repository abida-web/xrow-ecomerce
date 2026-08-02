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
      {" "}
      {invitations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No pending invitations
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations
                .filter((inv) => inv.status === "pending")
                .map((invitation: any, index: number) => (
                  <tr
                    key={invitation.id || index}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {invitation.email || invitation.invitedEmail}
                    </td>
                    <td className="px-4 py-3">{invitation.role}</td>
                    <td className="px-4 py-3">
                      {invitation.expiresAt
                        ? new Date(invitation.expiresAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="text-xs flex gap-2 bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-sm font-medium transition-colors"
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
