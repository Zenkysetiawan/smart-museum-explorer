"use client";

type Props = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({ message, type = "success" }: Props) {
  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        px-4 py-2 rounded-lg shadow text-white
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
    >
      {message}
    </div>
  );
}
