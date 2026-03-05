// src/app/components/ShareModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  Link2,
  Check,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Copy,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  description,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareOptions = [
    {
      name: "Copy Link",
      icon: <Link2 className="w-5 h-5" />,
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      },
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
      },
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
      },
      color: "bg-sky-500 hover:bg-sky-600 text-white",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
          "_blank",
        );
      },
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || title + "\n\n" + url)}`,
          "_blank",
        );
      },
      color: "bg-gray-600 hover:bg-gray-700 text-white",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || title,
          url: url,
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Share</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {description}
              </p>
            )}
            <p className="text-xs text-gray-400 truncate">{url}</p>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${option.color}`}
              >
                {option.name === "Copy Link" && copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  option.icon
                )}
                <span className="text-xs font-medium">
                  {option.name === "Copy Link" && copied
                    ? "Copied!"
                    : option.name}
                </span>
              </button>
            ))}
          </div>

          {/* Native Share (if available) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              More share options
            </button>
          )}

          {/* Link field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied!");
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
