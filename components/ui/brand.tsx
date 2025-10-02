"use client"

import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div className="flex cursor-pointer flex-col items-center">
      {/* <div className="mb-2">
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div> */}

      <div className="text-4xl font-bold tracking-wide">Junie</div>
      <div className="text-md mt-2 text-gray-500">The AI Assistant</div>
    </div>
  )
}
