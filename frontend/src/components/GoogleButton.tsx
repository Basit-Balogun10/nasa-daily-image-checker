import React from 'react'

interface propTypes {
    buttonText: string;
    onClickHandler: () => void;
}

const GoogleButton = ({buttonText, onClickHandler}: propTypes) => {
  return (
      <div
          className="google-btn w-max flex items-center justify-start border-2 border-[#4285F4] rounded"
          onClick={onClickHandler}
      >
          <img
              className="px-4 py-3 cursor-pointer"
              src="https://icongr.am/devicon/google-original.svg?size=25&color=currentColor"
              alt="google-logo"
          />
          <button className="font-roboto font-medium bg-[#4285F4] text-white px-6 py-4">
              {buttonText}
          </button>
      </div>
  );
}

export default GoogleButton