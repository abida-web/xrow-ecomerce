import CustomInput from "@/app/(seller)/dashboard/_components/CustomeInput";
import { Star, X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const ReviewModal = ({
  setOpenReviewModal,
  setReviewForm,
  reviewForm,
  handleAddReveiw,
  isPending,
}: {
  setOpenReviewModal: Dispatch<SetStateAction<boolean>>;
  setReviewForm: Dispatch<
    SetStateAction<{
      productId: string;
      organizationId: string;
      orderItemId: string;
      rating: number;
      title: string;
      comment: string;
    }>
  >;
  reviewForm: {
    productId: string;
    organizationId: string;
    orderItemId: string;
    rating: number;
    title: string;
    comment: string;
  };
  handleAddReveiw: () => void;
  isPending: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={() => setOpenReviewModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
        <div className=" flex flex-col gap-3">
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val, i) => (
                <button
                  key={i}
                  onClick={() => setReviewForm({ ...reviewForm, rating: val })}
                >
                  <Star
                    className={`h-5 w-5 ${val <= reviewForm.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"} `}
                  />
                </button>
              ))}
            </div>
            <span className=" text-gray-400 text-xs">Click a star to rate</span>
          </div>
          <CustomInput
            label="Review title"
            placeholder="Summarize your experience"
            value={reviewForm.title}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, title: e.target.value })
            }
          />

          <CustomInput
            label="Your review"
            placeholder="What was your experience with this product?"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAddReveiw}
          disabled={isPending}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 flex-1 text-white font-bold py-2 mt-3 px-8 w-full rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Submit review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
