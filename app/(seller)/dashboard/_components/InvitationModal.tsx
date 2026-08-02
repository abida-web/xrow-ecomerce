import { User, Mail, Briefcase } from "lucide-react";
import React from "react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";

type CreateStaffForm = {
  email: string;
  role: "driver" | "owner" | "member" | "staff";
};

interface InvitationModalProps {
  register: UseFormRegister<CreateStaffForm>;
  handleSubmit: UseFormHandleSubmit<CreateStaffForm>;
  errors: FieldErrors<CreateStaffForm>;
  isSubmitting: boolean;
  handleCreateStaff: (data: CreateStaffForm) => Promise<void>;
  setOpenInviteModal: (open: boolean) => void;
}

const InvitationModal: React.FC<InvitationModalProps> = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  handleCreateStaff,
  setOpenInviteModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-100 rounded-full p-4">
            <User className="w-10 h-10 text-orange-500" />
          </span>
          <h1 className="text-3xl font-bold mt-4 text-gray-100">
            Add Staff Member
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Invite a new driver or staff to your organization
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateStaff)}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="driver@company.com"
                disabled={isSubmitting}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-shadow"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register("role")}
                id="role"
                disabled={isSubmitting}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 appearance-none bg-white text-gray-900"
              >
                <option value="driver">Driver</option>
                <option value="staff">Staff</option>
                <option value="owner">Owner</option>
                <option value="member">Member</option>
              </select>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Adding Staff..."
            ) : (
              <>
                Invite Staff
                <User className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpenInviteModal(false)}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvitationModal;
